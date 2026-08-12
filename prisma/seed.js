const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Create user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'fazil@eureka.com' },
    update: {},
    create: {
      username: 'Fazil',
      email: 'fazil@eureka.com',
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
    where: { name: 'Office Supplies' },
    update: {},
    create: {
      name: 'Office Supplies',
    },
  });

  const category3 = await prisma.category.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: {
      name: 'Furniture',
    },
  });

  const category4 = await prisma.category.upsert({
    where: { name: 'Networking' },
    update: {},
    create: {
      name: 'Networking',
    },
  });

  const category5 = await prisma.category.upsert({
    where: { name: 'Computer Accessories' },
    update: {},
    create: {
      name: 'Computer Accessories',
    },
  });

  const category6 = await prisma.category.upsert({
    where: { name: 'Storage' },
    update: {},
    create: {
      name: 'Storage',
    },
  });

  const category7 = await prisma.category.upsert({
    where: { name: 'Cleaning Supplies' },
    update: {},
    create: {
      name: 'Cleaning Supplies',
    },
  });

  const category8 = await prisma.category.upsert({
    where: { name: 'Safety Equipment' },
    update: {},
    create: {
      name: 'Safety Equipment',
    },
  });

  console.log('Categories seeded:', category1, category2, category3, category4, category5, category6, category7, category8);

  // Create products
  const product1 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-001' },
    update: {
      mainImage: '/uploads/images/dummy_monitor.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_monitor_additional_1.jpg', '/uploads/images/dummy_monitor_additional_2.jpg']),
    },
    create: {
      categoryId: category1.id,
      productCode: 'PRD-20260811-001',
      name: '24-inch LED Monitor',
      mainImage: '/uploads/images/dummy_monitor.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_monitor_additional_1.jpg', '/uploads/images/dummy_monitor_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 15
        }
      }
    }
  });

  const product2 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-002' },
    update: {
      mainImage: '/uploads/images/dummy_laptop.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_laptop_additional_1.jpg', '/uploads/images/dummy_laptop_additional_2.jpg']),
    },
    create: {
      categoryId: category1.id,
      productCode: 'PRD-20260811-002',
      name: 'Laptop Asus ROG Strix G15',
      mainImage: '/uploads/images/dummy_laptop.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_laptop_additional_1.jpg', '/uploads/images/dummy_laptop_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 30
        }
      }
    }
  });

  const product3 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-003' },
    update: {
      mainImage: '/uploads/images/dummy_keyboard.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_keyboard_additional_1.jpg', '/uploads/images/dummy_keyboard_additional_2.jpg']),
    },
    create: {
      categoryId: category5.id,
      productCode: 'PRD-20260811-003',
      name: 'Mechanical Gaming Keyboard',
      mainImage: '/uploads/images/dummy_keyboard.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_keyboard_additional_1.jpg', '/uploads/images/dummy_keyboard_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 50
        }
      }
    }
  });

  const product4 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-004' },
    update: {
      mainImage: '/uploads/images/dummy_mouse.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_mouse_additional_1.jpg', '/uploads/images/dummy_mouse_additional_2.jpg']),
    },
    create: {
      categoryId: category5.id,
      productCode: 'PRD-20260811-004',
      name: 'Wireless Gaming Mouse',
      mainImage: '/uploads/images/dummy_mouse.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_mouse_additional_1.jpg', '/uploads/images/dummy_mouse_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 40
        }
      }
    }
  });

  const product5 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-005' },
    update: {
      mainImage: '/uploads/images/dummy_chair.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_chair_additional_1.jpg', '/uploads/images/dummy_chair_additional_2.jpg']),
    },
    create: {
      categoryId: category3.id,
      productCode: 'PRD-20260811-005',
      name: 'Ergonomic Office Chair',
      mainImage: '/uploads/images/dummy_chair.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_chair_additional_1.jpg', '/uploads/images/dummy_chair_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 20
        }
      }
    }
  });

  const product6 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-006' },
    update: {
      mainImage: '/uploads/images/dummy_router.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_router_additional_1.jpg', '/uploads/images/dummy_router_additional_2.jpg']),
    },
    create: {
      categoryId: category4.id,
      productCode: 'PRD-20260811-006',
      name: 'Wireless Router',
      mainImage: '/uploads/images/dummy_router.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_router_additional_1.jpg', '/uploads/images/dummy_router_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 25
        }
      }
    }
  });

  const product7 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-007' },
    update: {
      mainImage: '/uploads/images/dummy_usb_drive.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_usb_drive_additional_1.jpg', '/uploads/images/dummy_usb_drive_additional_2.jpg']),
    },
    create: {
      categoryId: category6.id,
      productCode: 'PRD-20260811-007',
      name: 'USB Flash Drive 64GB',
      mainImage: '/uploads/images/dummy_usb_drive.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_usb_drive_additional_1.jpg', '/uploads/images/dummy_usb_drive_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 100
        }
      }
    }
  });

  const product8 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-008' },
    update: {
      mainImage: '/uploads/images/dummy_cleaning_supplies.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_cleaning_supplies_additional_1.jpg', '/uploads/images/dummy_cleaning_supplies_additional_2.jpg']),
    },
    create: {
      categoryId: category7.id,
      productCode: 'PRD-20260811-008',
      name: 'Cleaning Supplies Kit',
      mainImage: '/uploads/images/dummy_cleaning_supplies.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_cleaning_supplies_additional_1.jpg', '/uploads/images/dummy_cleaning_supplies_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 60
        }
      }
    }
  });

  const product9 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-009' },
    update: {
      mainImage: '/uploads/images/dummy_safety_equipment.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_safety_equipment_additional_1.jpg', '/uploads/images/dummy_safety_equipment_additional_2.jpg']),
    },
    create: {
      categoryId: category8.id,
      productCode: 'PRD-20260811-009',
      name: 'Safety Equipment Set',
      mainImage: '/uploads/images/dummy_safety_equipment.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_safety_equipment_additional_1.jpg', '/uploads/images/dummy_safety_equipment_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 35
        }
      }
    }
  });

  const product10 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-010' },
    update: {
      mainImage: '/uploads/images/dummy_first_aid_kit.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_first_aid_kit_additional_1.jpg', '/uploads/images/dummy_first_aid_kit_additional_2.jpg']),
    },
    create: {
      categoryId: category8.id,
      productCode: 'PRD-20260811-010',
      name: 'First Aid Kit',
      mainImage: '/uploads/images/dummy_first_aid_kit.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_first_aid_kit_additional_1.jpg', '/uploads/images/dummy_first_aid_kit_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 20
        }
      }
    }
  });

  const product11 = await prisma.product.upsert({
    where: { productCode: 'PRD-20260811-011' },
    update: {
      mainImage: '/uploads/images/dummy_office_supplies.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_office_supplies_additional_1.jpg', '/uploads/images/dummy_office_supplies_additional_2.jpg']),
    },
    create: {
      categoryId: category2.id,
      productCode: 'PRD-20260811-011',
      name: 'Office Supplies Set',
      mainImage: '/uploads/images/dummy_office_supplies.jpg',
      additionalImages: JSON.stringify(['/uploads/images/dummy_office_supplies_additional_1.jpg', '/uploads/images/dummy_office_supplies_additional_2.jpg']),
      stocks: {
        create: {
          quantity: 80
        }
      }
    }
  });

  console.log('Products seeded:', product1, product2, product3, product4, product5, product6, product7, product8, product9, product10, product11);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
