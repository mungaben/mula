import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/configs/auth/authOptions';
import { UserProductStatus } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    return NextResponse.json({ isPurchased: false, hasEnoughBalance: false });
  }

  const userId = session?.user?.id;
  const productId = params.id;




  // Check if the user has an expired product
  const userProduct = await prisma.userProduct.findFirst({
    where: {
      userId,
      productId,
    },
  });



  // Retrieve the user's balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  


  // Retrieve the product details
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
 

  // Check if both user and product exist
  if (!product) {
    return NextResponse.json(
      { error: 'User or product not found' },
      { status: 404 }
    );
  }



  if (!user?.id) {
    return NextResponse.json(
      { error: 'User or product not found' },
      { status: 404 }
    );
  }





  // Check if the user has enough balance to purchase the product
  const hasEnoughBalance = user.balance >= product.price;

  // Check if the user product is expired
  const isExpired =
    userProduct && userProduct.status === UserProductStatus.EXPIRED;

  return NextResponse.json({
    isPurchased: !!userProduct, // True if the user has purchased it
    isExpired: false, // True if the user product is expired
    hasEnoughBalance,
  });
}
