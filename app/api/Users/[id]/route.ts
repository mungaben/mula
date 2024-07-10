// src/app/api/user/[id]/profile.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        deposits: true,
        withdrawals: true,
        interests: true,
        commissionsReceived: true,
        referrals: { include: { referee: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalDeposits = user.deposits.reduce((acc, deposit) => acc + deposit.amount, 0);
    const totalWithdrawals = user.withdrawals.reduce((acc, withdrawal) => acc + withdrawal.amount, 0);
    const totalInterest = user.interests.reduce((acc, interest) => acc + interest.amount, 0);
    const totalCommission = user.commissionsReceived.reduce((acc, commission) => acc + commission.amount, 0);

    const profile = {
      name: user.name,
      phone: user.phone,
      balance: user.balance,
      totalDeposits,
      totalWithdrawals,
      totalInterest,
      totalCommission,
      referrals: user.referrals.map(referral => ({
        name: referral.referee?.name,
        phone: referral.referee?.phone,
      })),
    };

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}