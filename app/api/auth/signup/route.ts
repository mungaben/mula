import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Adjust the path as needed for your prisma client

async function generateUniqueReferralLink(base: string): Promise<string> {
  let referralLink = base;
  let suffix = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { referralLink },
    });

    if (!existingUser) {
      break;
    }

    referralLink = `${base}${suffix}`;
    suffix++;
  }

  return referralLink;
}

export async function POST(req: NextRequest) {
  const { email, password, phone, name, usedReferralLink } = await req.json();

  if (!email || !password || !phone || !name) {
    return NextResponse.json({ error: 'Email, password, phone, and name are required' }, { status: 400 });
  }

  try {
    // Check if the user already exists based on email or phone number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists. Please sign in.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const baseReferralLink = name.replace(/\s+/g, '').toLowerCase();
    const referralLink = await generateUniqueReferralLink(baseReferralLink);

    const config = await prisma.config.findFirst();
    const initialBalance = config?.initialBal ?? 0;

  

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        name,
        balance: initialBalance, // Add initial balance here
        referralLink,
      },
    });

    // Handle used referral link
    if (usedReferralLink) {
      const referrer = await prisma.user.findUnique({
        where: { referralLink: usedReferralLink },
      });

      if (!referrer) {
        return NextResponse.json({ error: 'Invalid referral link' }, { status: 400 });
      }

      const config = await prisma.config.findFirst();
      if (!config) {
        return NextResponse.json({ error: 'Configuration not found' }, { status: 500 });
      }

      const { level1Percentage, level2Percentage, level3Percentage, linkLifetime } = config;

      const existingReferral = await prisma.referral.findFirst({
        where: { refereeId: referrer.id },
        orderBy: { createdAt: 'desc' }
      });

      let level = 1;
      let percentage = level1Percentage;

      if (existingReferral) {
        level = existingReferral.level + 1;
        percentage = level === 2 ? level2Percentage : level3Percentage;
      }

      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          refereeId: newUser.id,
          level,
          percentage,
          linkLifetime: new Date(new Date().getTime() + linkLifetime * 24 * 60 * 60 * 1000), // Link lifetime in days
        },
      });

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          referredBy: referrer.id,
        },
      });
    }

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
