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
      mainImage: '/uploads/images/dummy_laptop.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_laptop.jpg', '/uploads/images/dummy_chair.jpg']),
    },
    create: {
      categoryId: category1.id,
      productCode: 'PRD-20231015-001',
      name: 'Laptop Asus ROG',
      mainImage: '/uploads/images/dummy_laptop.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_laptop.jpg', '/uploads/images/dummy_chair.jpg']),
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
      mainImage: '/uploads/images/dummy_chair.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_chair.jpg', '/uploads/images/dummy_laptop.jpg']),
    },
    create: {
      categoryId: category2.id,
      productCode: 'PRD-20231015-002',
      name: 'Kursi Kantor Ergonomis',
      mainImage: '/uploads/images/dummy_chair.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_chair.jpg', '/uploads/images/dummy_laptop.jpg']),
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
