import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, simPhoneNumberId, amount } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const simPhoneNumber = await prisma.simPhoneNumber.findUnique({
      where: { id: simPhoneNumberId },
    });

    if (!simPhoneNumber) {
      return NextResponse.json({ error: "Invalid SIM phone number" }, { status: 400 });
    }

    await prisma.awaitingDeposit.create({
      data: {
        userId,
        simPhoneNumberId,
        amount,
      },
    });

    return NextResponse.json({ message: "Deposit initiated successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: " server error" }, { status: 500 });


    
  
  }
}
