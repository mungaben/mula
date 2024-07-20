// /products/[productId]/isPurchased.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/configs/auth/authOptions';

export async function GET(req: NextRequest,{params}:{params:{id:string}}) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ isPurchased: false });
  }

  const userId = session.user.id;
  const productId = params.id

  const userProduct = await prisma.userProduct.findFirst({
    where: {
      userId,
      productId,
    },
  });

  return NextResponse.json({ isPurchased: !!userProduct });
}
