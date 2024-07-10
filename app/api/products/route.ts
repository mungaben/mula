

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";



export async function GET(req:NextRequest,res:NextResponse) {

    // get product with all details 

    try {
        const products= await prisma.product.findMany()

        if (!products) {
            return NextResponse.json({error:"no such products"},{status:404})
            
        }
        return NextResponse.json(products)
        
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error fetching product', details: error.message }, { status: 500 });
          } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
          }
        
    }


    
}



export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated using the JWT token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Return a 401 response if the user is not authenticated
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, price, earningPer24Hours,growthPercentage } = await req.json();

    // Validate input
    if (!name || !price || !earningPer24Hours) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create new product
    const product = await prisma.product.create({
      data: {
        name,
        price,
        earningPer24Hours,
        growthPercentage
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // Properly typecast the error object
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Error adding product', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}