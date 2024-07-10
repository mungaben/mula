// src/app/api/config/[id]/route.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();


export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get('id');
  
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
  
    try {
      await prisma.config.delete({
        where: { id },
      });
      return NextResponse.json({ message: 'Configuration deleted successfully' }, { status: 204 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  



  export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get('id');
    const { minWithdrawalAmount, withdrawalFeePercentage, minBalance } = await req.json();
  
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
  
    try {
      const config = await prisma.config.update({
        where: { id },
        data: {
          minWithdrawalAmount,
          withdrawalFeePercentage,
          minBalance,
        },
      });
      return NextResponse.json(config, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }



