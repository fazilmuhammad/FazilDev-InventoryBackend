const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const exportToExcel = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, stocks: true },
      orderBy: { productCode: 'asc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Stok');

    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Kode Produk', key: 'productCode', width: 20 },
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Stok', key: 'stock', width: 10 },
      { header: 'Terakhir Diperbarui', key: 'lastUpdated', width: 25 },
    ];

    products.forEach((p, index) => {
      const stockQty = p.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
      const lastUpdated = p.stocks.length > 0 ? p.stocks[0].lastUpdated.toLocaleString() : '-';

      worksheet.addRow({
        no: index + 1,
        productCode: p.productCode,
        name: p.name,
        category: p.category.name,
        stock: stockQty,
        lastUpdated
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Laporan_Stok.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate Excel report', error: error.message });
  }
};

const exportToPDF = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, stocks: true },
      orderBy: { productCode: 'asc' }
    });

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Laporan_Stok.pdf');
    
    doc.pipe(res);

    doc.fontSize(20).text('Laporan Stok Inventaris', { align: 'center' });
    doc.moveDown();

    products.forEach((p, index) => {
      const stockQty = p.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
      doc.fontSize(12).text(`${index + 1}. [${p.productCode}] ${p.name}`);
      doc.fontSize(10).text(`Kategori: ${p.category.name} | Stok: ${stockQty}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF report', error: error.message });
  }
};

module.exports = {
  exportToExcel,
  exportToPDF
};
