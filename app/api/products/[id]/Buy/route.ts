// /app/api/products/[productId]/buy/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have prisma setup and configured

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const productId = params.id;
  const { userId } = await request.json();

  console.log('Received productId:', productId);
  console.log('Received userId:', userId);

  if (!productId || !userId) {
    return NextResponse.json({ error: 'Product ID or user ID is missing' }, { status: 400 });
  }

  try {
    // Find the product
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has enough balance
    if (user.balance < product.price) {
      console.log("Insufficient balance");
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Check if the user already bought the product
    const existingPurchase = await prisma.userProduct.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: 'Product already purchased' }, { status: 400 });
    }

    // Deduct product price from user's balance, create UserProduct entry, and update product's subscriber count
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: product.price } },
      }),
      prisma.userProduct.create({
        data: {
          userId: userId,
          productId: productId,
          daysRemaining: product.DaysToExpire ?? 0, // Set default if DaysToExpire is not provided
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { subscribersCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error buying product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}