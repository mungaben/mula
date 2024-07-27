// /app/api/products/[productId]/buy/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have prisma setup and configured
import { UserProductStatus } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const { userId } = await request.json();

  console.log('Received productId:', productId);
  console.log('Received userId:', userId);

  if (!productId || !userId) {
    return NextResponse.json(
      { error: 'Product ID or user ID is missing' },
      { status: 400 }
    );
  }

  try {
    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
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
      console.log('Insufficient balance');
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Check if the user already has an active purchase of the product
    const existingPurchase = await prisma.userProduct.findFirst({
      where: {
        userId: userId,
        productId: productId,
        status: UserProductStatus.ACTIVE,
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Product already purchased and active' },
        { status: 400 }
      );
    }

    // Check if the user has an expired purchase of the product
    const expiredPurchase = await prisma.userProduct.findFirst({
      where: {
        userId: userId,
        productId: productId,
        status: UserProductStatus.EXPIRED,
      },
    });

    // Process the transaction: Deduct balance, create product, update subscriber count
    await prisma.$transaction([
      // Deduct product price from user's balance
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: product.price } },
      }),
      // Create a new UserProduct entry if not exists, else reactivate it
      expiredPurchase
        ? prisma.userProduct.update({
            where: { id: expiredPurchase.id },
            data: {
              status: UserProductStatus.ACTIVE,
              daysRemaining: product.DaysToExpire ?? 0,
              interestAccrued: 0,
            },
          })
        : prisma.userProduct.create({
            data: {
              userId: userId,
              productId: productId,
              daysRemaining: product.DaysToExpire ?? 0,
              status: UserProductStatus.ACTIVE,
            },
          }),
      // Update product's subscriber count
      prisma.product.update({
        where: { id: productId },
        data: { subscribersCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error buying product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
