import { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export async function registerReferral(referralLink: string, userId: string) {
  try {
    const referrer = await prisma.user.findUnique({
      where: { referralLink },
    });

    if (!referrer) {
      return { error: 'Invalid referral link' };
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

    return { message: 'Referral registered and commissions calculated' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Server error occurred" };
  }
}
