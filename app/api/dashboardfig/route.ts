import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Calculate dates for today and yesterday
    const today = new Date();
    const yesterday = subDays(today, 1);

    // Helper function to calculate percentage change
    const calculatePercentageChange = (todayValue: number, yesterdayValue: number) => {
      if (yesterdayValue === 0) return 0;
      return ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    };

    // Fetch totals for today
    const [
      totalDepositsToday,
      totalWithdrawalsToday,
      totalInterestsToday,
      totalBalanceToday,
      totalSubscriptionsToday,
      newUsersToday
    ] = await Promise.all([
      prisma.deposit.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfDay(today), lt: endOfDay(today) } },
      }),
      prisma.withdrawalRequest.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfDay(today), lt: endOfDay(today) } },
      }),
      prisma.interest.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfDay(today), lt: endOfDay(today) } },
      }),
      prisma.user.aggregate({
        _sum: { balance: true },
      }),
      prisma.userProduct.aggregate({
        _count: { id: true },
        where: { createdAt: { gte: startOfDay(today), lt: endOfDay(today) } },
      }),
      prisma.user.aggregate({
        _count: { id: true },
        where: { createdAt: { gte: startOfDay(today), lt: endOfDay(today) } },
      })
    ]);

    // Fetch totals for yesterday
    const [
      totalDepositsYesterday,
      totalWithdrawalsYesterday,
      totalInterestsYesterday,
      totalSubscriptionsYesterday,
      newUsersYesterday
    ] = await Promise.all([
      prisma.deposit.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfDay(yesterday), lt: endOfDay(yesterday) } },
      }),
      prisma.withdrawalRequest.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfDay(yesterday), lt: endOfDay(yesterday) } },
      }),
      prisma.interest.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: startOfDay(yesterday), lt: endOfDay(yesterday) } },
      }),
      prisma.userProduct.aggregate({
        _count: { id: true },
        where: { createdAt: { gte: startOfDay(yesterday), lt: endOfDay(yesterday) } },
      }),
      prisma.user.aggregate({
        _count: { id: true },
        where: { createdAt: { gte: startOfDay(yesterday), lt: endOfDay(yesterday) } },
      })
    ]);

    const totalRevenueToday = (totalDepositsToday._sum.amount || 0) - (totalWithdrawalsToday._sum.amount || 0);
    const totalRevenueYesterday = (totalDepositsYesterday._sum.amount || 0) - (totalWithdrawalsYesterday._sum.amount || 0);

    const totalRevenueChange = calculatePercentageChange(totalRevenueToday, totalRevenueYesterday);
    const totalSubscriptionsChange = calculatePercentageChange(totalSubscriptionsToday._count.id, totalSubscriptionsYesterday._count.id);
    const newUsersChange = calculatePercentageChange(newUsersToday._count.id, newUsersYesterday._count.id);
    const totalInterestsChange = calculatePercentageChange(totalInterestsToday._sum.amount || 0, totalInterestsYesterday._sum.amount || 0);

    return NextResponse.json({
      totalRevenue: {
        amount: totalRevenueToday,
        change: totalRevenueChange
      },
      totalSubscriptions: {
        count: totalSubscriptionsToday._count.id,
        change: totalSubscriptionsChange
      },
      newUsers: {
        count: newUsersToday._count.id,
        change: newUsersChange
      },
      totalInterests: {
        amount: totalInterestsToday._sum.amount || 0,
        change: totalInterestsChange
      },
      totalBalance: totalBalanceToday._sum.balance || 0
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
