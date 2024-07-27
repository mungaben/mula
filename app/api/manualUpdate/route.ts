import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import userproduct from '@/app/products/userproduct';
import { UserProductStatus } from '@prisma/client';

// Set the time interval for testing and production
const TEST_MODE = true; // Set this to false for production
const INTERVAL_MINUTES = TEST_MODE ? 0.5 : 60 * 24; // 1 minute for testing, 1440 minutes (24 hours) for production

/**
 * Function to perform the daily update on user products.
 * @param runSource - The source of the script execution, e.g., 'manual', 'cron'
 */
async function dailyUpdate(runSource: string) {
  let accountsUpdated = 0;
  let totalInterestAccumulated = 0;
  let totalBalances = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  try {
    // Fetch all active user products along with associated product details
    const userProducts = await prisma.userProduct.findMany({
      where: {
        status:UserProductStatus.ACTIVE   , // Only update active products
      },
      include: { product: true },
    });





    console.log("userproroducts",userProducts)

    // Loop through each active user product and update days remaining and interest accrued
    for (const userProduct of userProducts) {
      if (userProduct.daysRemaining !== null && userProduct.daysRemaining > 0) {
        const newDaysRemaining = userProduct.daysRemaining - 1;
        const interestAccrued =(userProduct.product.price * userProduct.product.growthPercentage) /100;
        const newInterestAccrued = userProduct.interestAccrued + interestAccrued;




        console.warn("userproducts",userProduct,newDaysRemaining,interestAccrued,newInterestAccrued)

        // Update user product in the database
        await prisma.userProduct.update({
          where: { id: userProduct.id },
          data: {
            daysRemaining: newDaysRemaining,
            interestAccrued: newInterestAccrued,
          },
        });

        // Update user balance and record interest
        await prisma.user.update({
          where: { id: userProduct.userId },
          data: {
            balance: {
              increment: interestAccrued,
            },
          },
        });

        // Create an entry in the Interest model
        await prisma.interest.create({
          data: {
            userId: userProduct.userId,
            userProductId: userProduct.id,
            amount: interestAccrued,
          },
        });

        accountsUpdated += 1;
        totalInterestAccumulated += interestAccrued;

        // Mark product as expired if days remaining is zero
        if (newDaysRemaining === 0) {
          await prisma.userProduct.update({
            where: { id: userProduct.id },
            data: {
              status: UserProductStatus.EXPIRED, // Mark as expired
            },
          });
        }
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

    // Record the last run details in the database
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
    // Optional disconnect based on your application's architecture
    await prisma.$disconnect();
  }
}

/**
 * Handles the POST request for manually running the daily update.
 * @param req - The incoming request object
 */
export async function POST(req: NextRequest) {
  try {
    // Check the last run time from the database
    const lastRun = await prisma.lastRun.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    console.warn("lastrun",lastRun)

    const now = new Date();
    const lastRunDate = new Date(lastRun?.updatedAt || 0);
    const minutesSinceLastRun = Math.abs(now.getTime() - lastRunDate.getTime()) / 60000; // Convert to minutes

    if (minutesSinceLastRun < INTERVAL_MINUTES) {

      console.warn("The script has already run within the last 1 minute.");
      
      return NextResponse.json({
        message: 'The script has already run within the last 1 minute.',
      });
    }

    // Run the update manually
    const result = await dailyUpdate('manual');


    console.log("result",result)

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error during manual update:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handles the GET request, indicating the correct usage.
 * @param req - The incoming request object
 */
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: 'Use POST method to run the update' },
    { status: 405 }
  );
}
