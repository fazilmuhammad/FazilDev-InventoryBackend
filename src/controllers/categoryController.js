const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    let whereClause = {};
    if (search) {
      whereClause.name = { contains: search };
    }

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const [categories, total] = await Promise.all([
        prisma.category.findMany({
          where: whereClause,
          skip,
          take: limitNum,
          orderBy: { name: 'asc' }
        }),
        prisma.category.count({ where: whereClause })
      ]);

      return res.json({
        data: categories,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }

    // Backward compatibility: If no page/limit provided, return all as array
    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
