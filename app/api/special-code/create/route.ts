import { createSpecialCode, generateUniqueCode, getActiveSpecialCodes, getAllSpecialCodes } from "@/app/server-actions/specialCodeActions";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/configs/auth/authOptions";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
   const code =await generateUniqueCode()

   

   



  try {
    const {totalAmount, redeemAmount, expiresAt, userId } = await req.json();
    
    const newSpecialCode = await prisma.specialCode.create({
      data: {
        code: code,
        totalAmount,
        redeemAmount,
        currentAmount: 0,
        expiresAt: new Date(expiresAt),
        userId,
      },
    });
    
    return NextResponse.json(newSpecialCode);
  } catch (error) {
    console.error('Error creating special code:', error);
    return NextResponse.json({ error: 'An unknown error occurred', status: 400 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("url", searchParams);
    
    const fetchAll = searchParams.get('all');
    console.log("fetchall", fetchAll);

    if (fetchAll) {
      const allSpecialCodes = await getAllSpecialCodes();
      console.log("allspecialodes", allSpecialCodes);
      return NextResponse.json(allSpecialCodes, { status: 200 });
    } else {
      const activeSpecialCodes = await getActiveSpecialCodes();
      console.log("logall active", activeSpecialCodes);
      return NextResponse.json(activeSpecialCodes, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching special codes:', error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 400 });
  }
}
