const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Create user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'fazil@eurika.com' },
    update: {},
    create: {
      username: 'Fazil',
      email: 'fazil@eurika.com',
      password: hashedPassword,
      phone: '081234567890',
      position: 'Administrator',
      avatar: '/uploads/images/default_profile.jpg'
    },
  });
  console.log('User seeded:', user);
  // Create categories
  const category1 = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: {
      name: 'Furniture',
    },
  });

  console.log('Categories seeded:', category1, category2);

  // Create products
  const product1 = await prisma.product.upsert({
    where: { productCode: 'PRD-20231015-001' },
    update: {
      sku: 'SKU-001',
      barcode: '100000000001',
      mainImage: '/uploads/images/dummy_laptop.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_laptop.jpg', '/uploads/images/dummy_chair.jpg']),
      price: 1500.00,
      vendor: 'Asus Global',
      location: 'Warehouse A - Section 1'
    },
    create: {
      categoryId: category1.id,
      productCode: 'PRD-20231015-001',
      name: 'Laptop Asus ROG',
      sku: 'SKU-001',
      barcode: '100000000001',
      mainImage: '/uploads/images/dummy_laptop.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_laptop.jpg', '/uploads/images/dummy_chair.jpg']),
      price: 1500.00,
      vendor: 'Asus Global',
      location: 'Warehouse A - Section 1',
      stocks: {
        create: {
          quantity: 15
        }
      }
    }
  });

  const product2 = await prisma.product.upsert({
    where: { productCode: 'PRD-20231015-002' },
    update: {
      sku: 'SKU-002',
      barcode: '100000000002',
      mainImage: '/uploads/images/dummy_chair.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_chair.jpg', '/uploads/images/dummy_laptop.jpg']),
      price: 120.50,
      vendor: 'IKEA',
      location: 'Warehouse B - Section 4'
    },
    create: {
      categoryId: category2.id,
      productCode: 'PRD-20231015-002',
      name: 'Office Chair',
      sku: 'SKU-002',
      barcode: '100000000002',
      mainImage: '/uploads/images/dummy_chair.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_chair.jpg', '/uploads/images/dummy_laptop.jpg']),
      price: 120.50,
      vendor: 'IKEA',
      location: 'Warehouse B - Section 4',
      stocks: {
        create: {
          quantity: 30
        }
      }
    }
  });

  console.log('Products seeded:', product1, product2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
