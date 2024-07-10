import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const phoneNumbers = await prisma.simPhoneNumber.findMany();
    return NextResponse.json(phoneNumbers, { status: 200 });
  } catch (error) {
    
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: " server error" }, { status: 500 });


    
  }
}
