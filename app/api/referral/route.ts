import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, usedReferralLink } = await req.json();

    const config = await prisma.config.findFirst();
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 500 });
    }

    const { level1Percentage, level2Percentage, level3Percentage, linkLifetime } = config;

    const now = new Date();

    // Check if the user already has an active referral link
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referralLink: true,
        referralLinkExpiry: true,
        referrals: {
          select: {
            referee: {
              select: {
                name: true,
                email: true,
                deposits: {
                  select: {
                    amount: true,
                  },
                  where: {
                    status: 'FULFILLED',
                  },
                },
              },
            },
            percentage: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let referralLink = user.referralLink;
    if (referralLink && user.referralLinkExpiry && user.referralLinkExpiry > now) {
      // The referral link exists and is not expired
      return NextResponse.json({ referralLink, referrals: user.referrals }, { status: 200 });
    } else {
      // Generate a new referral link
      referralLink = nanoid();
      const linkLifetimeDate = new Date(now.getTime() + linkLifetime * 24 * 60 * 60 * 1000); // Link lifetime in days

      await prisma.user.update({
        where: { id: userId },
        data: {
          referralLink,
          referralLinkExpiry: linkLifetimeDate,
        },
      });

      await prisma.referral.createMany({
        data: [
          {
            referrerId: userId,
            level: 1,
            percentage: level1Percentage,
            linkLifetime: linkLifetimeDate,
          },
          {
            referrerId: userId,
            level: 2,
            percentage: level2Percentage,
            linkLifetime: linkLifetimeDate,
          },
          {
            referrerId: userId,
            level: 3,
            percentage: level3Percentage,
            linkLifetime: linkLifetimeDate,
          },
        ],
      });

      // Track the used referral link
      if (usedReferralLink) {
        await prisma.userReferralLink.create({
          data: {
            userId: userId,
            referralLink: usedReferralLink,
          },
        });
      }

      return NextResponse.json({ referralLink, referrals: [] }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const referees = await prisma.user.findMany({
      where: {
        referredBy: userId,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ referees }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}

