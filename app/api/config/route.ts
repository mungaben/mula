// src/app/api/config/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { minWithdrawalAmount, withdrawalFeePercentage, minBalance } = await req.json();

  try {
    const config = await prisma.config.create({
      data: {
        minWithdrawalAmount,
        withdrawalFeePercentage,
        minBalance,
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




  




