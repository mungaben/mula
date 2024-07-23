import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/configs/auth/authOptions';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ isPurchased: false, hasEnoughBalance: false });
  }

  const userId = session.user.id;
  const productId = params.id;

  const userProduct = await prisma.userProduct.findFirst({
    where: {
      userId,
      productId,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!user || !product) {
    return NextResponse.json({ error: 'User or product not found' }, { status: 404 });
  }

  const hasEnoughBalance = user.balance >= product.price;

  return NextResponse.json({ isPurchased: !!userProduct, hasEnoughBalance });
}
