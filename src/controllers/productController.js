const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateProductCode = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const prefix = `PRD-${dateStr}-`;
  
  const lastProduct = await prisma.product.findFirst({
    where: { productCode: { startsWith: prefix } },
    orderBy: { productCode: 'desc' }
  });

  if (!lastProduct) {
    return `${prefix}001`;
  }
  
  const lastSequence = parseInt(lastProduct.productCode.split('-')[2]);
  const newSequence = String(lastSequence + 1).padStart(3, '0');
  return `${prefix}${newSequence}`;
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : undefined;

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { productCode: { contains: search } }
          ]
        } : {},
        categoryId ? { categoryId } : {}
      ]
    };

    const total = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        stocks: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: products.map(p => ({
         ...p,
         stock: p.stocks.reduce((acc, stock) => acc + stock.quantity, 0),
         additionalImages: p.additionalImages ? JSON.parse(p.additionalImages) : []
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, stocks: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
       ...product,
       stock: product.stocks.reduce((acc, stock) => acc + stock.quantity, 0),
       additionalImages: product.additionalImages ? JSON.parse(product.additionalImages) : []
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, categoryId, stockQuantity } = req.body;
    
    // Handle images
    if (!req.files || !req.files.main_image) {
      return res.status(400).json({ message: 'Main image is required.' });
    }

    const mainImage = `/uploads/images/${req.files.main_image[0].filename}`;
    const additionalImages = req.files.additional_images 
      ? JSON.stringify(req.files.additional_images.map(file => `/uploads/images/${file.filename}`))
      : null;

    const productCode = await generateProductCode();

    const product = await prisma.product.create({
      data: {
        productCode,
        name,
        categoryId: parseInt(categoryId),
        mainImage,
        additionalImages,
        stocks: {
          create: {
            quantity: stockQuantity ? parseInt(stockQuantity) : 0
          }
        }
      },
      include: { stocks: true }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, categoryId, stockQuantity } = req.body;

    const updateData = {
      name,
      categoryId: parseInt(categoryId),
    };

    if (req.files && req.files.main_image) {
      updateData.mainImage = `/uploads/images/${req.files.main_image[0].filename}`;
    }

    if (req.files && req.files.additional_images) {
      updateData.additionalImages = JSON.stringify(req.files.additional_images.map(file => `/uploads/images/${file.filename}`));
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    // Update stock if provided
    if (stockQuantity !== undefined) {
      // For simplicity, updating the first stock entry or creating one
      const existingStock = await prisma.stock.findFirst({ where: { productId: id }});
      if (existingStock) {
         await prisma.stock.update({
           where: { id: existingStock.id },
           data: { quantity: parseInt(stockQuantity) }
         });
      } else {
         await prisma.stock.create({
           data: { productId: id, quantity: parseInt(stockQuantity) }
         });
      }
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

const adjustStock = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { adjustment } = req.body;

    if (adjustment === undefined || isNaN(parseInt(adjustment))) {
      return res.status(400).json({ message: 'Valid adjustment amount required' });
    }

    const newStock = await prisma.stock.create({
      data: {
        productId: id,
        quantity: parseInt(adjustment)
      }
    });

    res.json({ message: 'Stock adjusted successfully', data: newStock });
  } catch (error) {
    res.status(500).json({ message: 'Failed to adjust stock', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock
};
