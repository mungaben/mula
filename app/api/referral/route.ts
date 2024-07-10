import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, level1Percentage, level2Percentage, level3Percentage, linkLifetime } = await req.json();
    
    const referralLink = nanoid();
    const linkLifetimeDate = new Date(new Date().getTime() + linkLifetime * 24 * 60 * 60 * 1000); // Link lifetime in days
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        referralLink,
      },
    });

    await prisma.referral.create({
      data: {
        referrer: { connect: { id: userId } },
        referee: undefined,  // Use undefined instead of null
        level: 1,
        percentage: level1Percentage,
        linkLifetime: linkLifetimeDate,
      },
    });

    await prisma.referral.create({
      data: {
        referrer: { connect: { id: userId } },
        referee: undefined,  // Use undefined instead of null
        level: 2,
        percentage: level2Percentage,
        linkLifetime: linkLifetimeDate,
      },
    });

    await prisma.referral.create({
      data: {
        referrer: { connect: { id: userId } },
        referee: undefined,  // Use undefined instead of null
        level: 3,
        percentage: level3Percentage,
        linkLifetime: linkLifetimeDate,
      },
    });

    return NextResponse.json({ referralLink }, { status: 200 });
  } catch (error) {
    if (error instanceof Error){
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "server error occured"}, { status: 500 });


   
  }
}
