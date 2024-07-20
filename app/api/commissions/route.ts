import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const commissions = await prisma.commission.findMany({
      where: { userId },
    });
    return NextResponse.json(commissions, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });

        
    }
    return NextResponse.json({ error: "error in server" }, { status: 500 });
   
  }
}
