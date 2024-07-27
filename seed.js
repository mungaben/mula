const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional)
  await prisma.commission.deleteMany();
  await prisma.userProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'mungaben21@gmail.com',
      phone: '0795853985',
      password: '1234567890',
      balance: 1000,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      phone: '0987654321',
      password: 'password123',
      balance: 500,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Product 1',
      price: 100,
      DaysToExpire: 30,
      earningPer24Hours: 5.0,
      growthPercentage: 10,
      subscribersCount: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product 2',
      price: 200,
      DaysToExpire: 60,
      earningPer24Hours: 10.0,
      growthPercentage: 15,
      subscribersCount: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // Seed UserProducts
  await prisma.userProduct.create({
    data: {
      userId: user1.id,
      productId: product1.id,
      createdAt: new Date(),
      daysRemaining: 30,
      interestAccrued: 0.0,
    }
  });

  await prisma.userProduct.create({
    data: {
      userId: user2.id,
      productId: product2.id,
      createdAt: new Date(),
      daysRemaining: 60,
      interestAccrued: 0.0,
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
