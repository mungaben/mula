import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function calculateInterest() {
  try {
    const userProducts = await prisma.userProduct.findMany({
      include: {
        user: true,
        product: true,
      },
    });

    for (const userProduct of userProducts) {
      const growthPercentage = userProduct.product.growthPercentage;
      const amount = userProduct.product.price;
      const interestAmount = (amount * growthPercentage) / 100;

      // Save the interest
      await prisma.interest.create({
        data: {
          userId: userProduct.userId,
          userProductId: userProduct.id,
          amount: interestAmount,
        },
      });

      // Update the user's balance with total interest
      await prisma.user.update({
        where: { id: userProduct.userId },
        data: { balance: { increment: interestAmount } },
      });
    }

    console.log('Interest calculated and updated successfully.');
  } catch (error) {
    console.error('Error calculating interest:', error);
  } finally {
    await prisma.$disconnect();
  }
}

calculateInterest();
