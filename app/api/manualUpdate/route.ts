import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function dailyUpdate(runSource: string) {
  let accountsUpdated = 0;
  let totalInterestAccumulated = 0;
  let totalBalances = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  try {
    const userProducts = await prisma.userProduct.findMany({
      include: { product: true },
    });

    for (const userProduct of userProducts) {
      if (userProduct.daysRemaining !== null && userProduct.daysRemaining > 0) {
        const newDaysRemaining = userProduct.daysRemaining - 1;
        const newInterestAccrued = userProduct.interestAccrued + (userProduct.product.price * userProduct.product.growthPercentage / 100);

        await prisma.userProduct.update({
          where: { id: userProduct.id },
          data: {
            daysRemaining: newDaysRemaining,
            interestAccrued: newInterestAccrued,
          },
        });

        accountsUpdated += 1;
        totalInterestAccumulated += newInterestAccrued - userProduct.interestAccrued;
      }
    }

    // Calculate total balances
    const totalBalancesResult = await prisma.user.aggregate({
      _sum: {
        balance: true,
      },
    });
    totalBalances = totalBalancesResult._sum.balance || 0;

    // Calculate total deposits
    const totalDepositsResult = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
    });
    totalDeposits = totalDepositsResult._sum.amount || 0;

    // Calculate total withdrawals
    const totalWithdrawalsResult = await prisma.withdrawalRequest.aggregate({
      _sum: {
        amount: true,
      },
    });
    totalWithdrawals = totalWithdrawalsResult._sum.amount || 0;

    // Update the last run details in the database
    await prisma.lastRun.create({
      data: {
        runSource,
        accountsUpdated,
        totalInterestAccumulated,
        totalBalances,
        totalDeposits,
        totalWithdrawals,
      },
    });

    console.log(`Daily update completed successfully by ${runSource}.`);
    return { message: `Daily update completed successfully by ${runSource}.` };
  } catch (error) {
    console.error('Error during daily update:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check last run time from the database
    const lastRun = await prisma.lastRun.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const now = new Date();
    const lastRunDate = new Date(lastRun?.updatedAt || 0);
    const hoursSinceLastRun = Math.abs(now.getTime() - lastRunDate.getTime()) / 36e5;

    if (hoursSinceLastRun < 24) {
      return NextResponse.json({ message: 'The script has already run within the last 24 hours.' });
    }

    // Run the update manually
    const result = await dailyUpdate('manual');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error during manual update:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Use POST method to run the update' }, { status: 405 });
}
