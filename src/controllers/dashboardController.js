const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();

    // Get all products with their stocks to calculate value and identify low stock
    const products = await prisma.product.findMany({
      include: {
        stocks: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let totalInventoryValue = 0;
    const productsWithStock = products.map(p => {
      const totalStock = p.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
      const value = totalStock * (p.price ? parseFloat(p.price) : 0);
      totalInventoryValue += value;
      
      return {
        ...p,
        totalStock
      };
    });

    // Identify low stock (totalStock < 10)
    const lowStockAlerts = productsWithStock
      .filter(p => p.totalStock < 10)
      .sort((a, b) => a.totalStock - b.totalStock)
      .slice(0, 5); // top 5 lowest

    // Recently added products (top 5)
    const recentProducts = productsWithStock.slice(0, 5);

    res.json({
      totalProducts,
      totalCategories,
      totalInventoryValue,
      lowStockAlerts,
      recentProducts
    });
  } catch (error) {
    console.error('Failed to get dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

module.exports = {
  getStats
};
