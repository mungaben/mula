import { PrismaClient, UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import authOptions from '@/lib/configs/auth/authOptions';

const prisma = new PrismaClient();

async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("logs",session?.user);
  
  if (!session) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  console.log("user role",user?.role);
  

  return user?.role === UserRole.ADMIN;
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { minWithdrawalAmount, withdrawalFeePercentage, minBalance, level1Percentage, level2Percentage, level3Percentage, linkLifetime } = await req.json();

  try {
    const existingConfig = await prisma.config.findFirst();
    if (existingConfig) {
      return NextResponse.json({ error: 'Configuration already exists. Use PUT to update.' }, { status: 400 });
    }

    const config = await prisma.config.create({
      data: {
        minWithdrawalAmount,
        withdrawalFeePercentage,
        minBalance,
        level1Percentage,
        level2Percentage,
        level3Percentage,
        linkLifetime,
      },
    });
    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const config = await prisma.config.findFirst();
    if (config) {
      return NextResponse.json(config, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updatedData = await req.json();

  try {
    const existingConfig = await prisma.config.findFirst();
    if (!existingConfig) {
      return NextResponse.json({ error: 'Configuration not found. Use POST to create.' }, { status: 404 });
    }

    const config = await prisma.config.update({
      where: { id: existingConfig.id },
      data: {
        minWithdrawalAmount: updatedData.minWithdrawalAmount,
        withdrawalFeePercentage: updatedData.withdrawalFeePercentage,
        minBalance: updatedData.minBalance,
        level1Percentage: updatedData.level1Percentage,
        level2Percentage: updatedData.level2Percentage,
        level3Percentage: updatedData.level3Percentage,
        linkLifetime: updatedData.linkLifetime,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
