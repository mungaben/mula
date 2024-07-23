// /app/api/products/[productId]/buy/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have prisma setup and configured

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const productId = params.id;
  const { userId } = await request.json();

  console.log('Received productId:', productId); // Debugging line
  console.log('Received userId:', userId); // Debugging line

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is missing' }, { status: 400 });
  }

  try {
    // Find the product and user
    const product = await prisma.product.findUnique({ where: { id: productId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!product || !user) {
      return NextResponse.json({ error: 'Product or user not found' }, { status: 404 });
    }

    // Check if user has enough balance
    if (user.balance < product.price) {
        console.log("error balance","insufficient")

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

    // Deduct product price from user's balance and create UserProduct entry
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: product.price } },
      }),
      prisma.userProduct.create({
        data: {
          userId: userId,
          productId: productId,
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
