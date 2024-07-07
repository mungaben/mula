import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){


    const {searchParams}=new URL(req.url)

    const id=searchParams.get('id')

    // handle no id
    if (!id) {
        return NextResponse.json({error:"no id passed in params"},{status:404})
        
    }

    try {
        const product = await prisma.product.findUnique({where:{id:id}})

        if (!product) {
            return NextResponse.json({error:" product not found"},{status:404})
            
        }


        return NextResponse.json(product)

        
        
    } catch (error) {

        return NextResponse.json({error:'error fetching product'},{status:500})
        
    }
}