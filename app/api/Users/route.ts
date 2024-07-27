// src/app/api/Users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';



export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        deposits: true,
        withdrawals: true,
        interests: true,
        commissionsReceived: true,
        commissionsGiven: true,
        referrals: { include: { referee: true } },
        referred: { include: { referrer: true } },
        promotionRequests: true,
        notifications: true,
        promotionCodes: true,
        awaitingDeposits: true,
        products: { include: { product: true } },
        referralLinksUsed: true,
      },
    });



    console.warn("users from users",users)

    const detailedUsers = users.map(user => {
      const totalDeposits = user.deposits.reduce((acc, deposit) => acc + deposit.amount, 0);
      const totalWithdrawals = user.withdrawals.reduce((acc, withdrawal) => acc + withdrawal.amount, 0);
      const totalInterest = user.interests.reduce((acc, interest) => acc + interest.amount, 0);
      const totalCommissionsReceived = user.commissionsReceived.reduce((acc, commission) => acc + commission.amount, 0);
      const totalCommissionsGiven = user.commissionsGiven.reduce((acc, commission) => acc + commission.amount, 0);

      return {
        ...user,
        totalDeposits,
        totalWithdrawals,
        totalInterest,
        totalCommissionsReceived,
        totalCommissionsGiven,
      };
    });


    console.info("detaileduers",detailedUsers)

    return NextResponse.json(detailedUsers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
