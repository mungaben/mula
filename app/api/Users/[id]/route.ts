import { PrismaClient } from '@prisma/client';
import { UserRoundIcon } from 'lucide-react';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url!);
  // const userId = searchParams.get('id');
  const userId=params.id



  console.log("userId",userId)

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
      email:user.email,
      role: user.role,
      userId:user.id,
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

export async function POST(req: NextRequest,{ params }: { params: { id: string } }) {
  const userId = params.id
  try {
    const data = await req.json();

    const newUser = await prisma.user.create({
      data,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest,{ params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url!);
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const data = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
