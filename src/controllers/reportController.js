const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');

const exportToExcel = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, stocks: true },
      orderBy: { productCode: 'asc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Stock Report');

    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Product Code', key: 'productCode', width: 20 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Last Updated', key: 'lastUpdated', width: 25 },
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
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Stock_Report.xlsx');

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

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Stock_Report.pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(20).text('Stock Report', { align: 'center' });
    doc.moveDown(0.5);

    // Print Date
    const printDate = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    doc.fontSize(10).fillColor('gray').text(`Print Date: ${printDate}`, { align: 'center' });
    doc.moveDown(2);

    // Table Data
    const tableRows = products.map((p, index) => {
      const stockQty = p.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
      return [
        (index + 1).toString(),
        p.productCode,
        p.name,
        p.category?.name || '-',
        stockQty.toString()
      ];
    });

    const tableArray = {
      headers: [
        { label: "No", width: 30 },
        { label: "Product Code", width: 100 },
        { label: "Product Name", width: 220 },
        { label: "Category", width: 120 },
        { label: "Stock", width: 50 }
      ],
      rows: tableRows
    };

    await doc.table(tableArray, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10).fillColor('black'),
      prepareRow: () => doc.font("Helvetica").fontSize(10).fillColor('black')
    });

    doc.end();
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF report', error: error.message });
  }
};

module.exports = {
  exportToExcel,
  exportToPDF
};
