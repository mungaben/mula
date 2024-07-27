import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/configs/auth/authOptions';

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  console.log("usersession", session);

  try {
    if (session) {
      const userId = session.user.id;

      const purchasedProducts = await prisma.product.findMany({})


      console.log("purchased products",purchasedProducts );
      

      
 
      return NextResponse.json(purchasedProducts);
    } else {
      const products = await prisma.product.findMany({
        where: {
          name: {
            not: null,
          },
        },
      });

      console.log("products",products );
      

      if (!products.length) {
        return NextResponse.json({ error: "No products available" }, { status: 404 });
      }

      return NextResponse.json(products);
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Error fetching products', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
