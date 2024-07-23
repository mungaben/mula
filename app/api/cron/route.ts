// /app/api/cron/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/prisma';

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

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');
  if (!authorizationHeader || authorizationHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await calculateInterest();
  return NextResponse.json({ message: 'Interest calculation triggered successfully' });
}
