import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { referralLink, userId } = await req.json();

    const referrer = await prisma.user.findUnique({
      where: { referralLink },
    });

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral link' }, { status: 400 });
    }

    const referrals = await prisma.referral.findMany({
      where: { referrerId: referrer.id },
      orderBy: { level: 'asc' },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { referredBy: referrer.id },
    });

    for (const referral of referrals) {
      await prisma.referral.update({
        where: { id: referral.id },
        data: { referee: { connect: { id: userId } } },
      });

      const commissionAmount = referral.percentage;
      await prisma.commission.create({
        data: {
          userId,
          referrerId: referral.referrerId,
          amount: commissionAmount,
          level: referral.level,
          pending: true,
        },
      });
    }

    // Check the number of successful referrals with deposits
    const successfulReferrals = await prisma.referral.count({
      where: {
        referrerId: referrer.id,
        referee: {
          deposits: {
            some: {}
          }
        }
      }
    });

    if (successfulReferrals > 3) {
      // Create a subadmin promotion request
      await prisma.promotionRequest.create({
        data: {
          userId: referrer.id,
          status: 'PENDING',  // Default status set in the schema
          roleRequested: 'SUBADMIN',
        }
      });
    }

    return NextResponse.json({ message: 'Referral registered and commissions calculated' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "server error " }, { status: 500 });
  }
}
