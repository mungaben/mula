import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DepositRequest = {
  userId: string;
  phoneNumber: string;
  depositPhoneNumber: string;
  amount: number;
};

export async function POST(req: NextRequest) {
  const body: DepositRequest = await req.json();

  const { userId, phoneNumber, depositPhoneNumber, amount } = body;

  try {
    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the depositPhoneNumber is valid
    const simPhoneNumber = await prisma.simPhoneNumber.findUnique({
      where: { phoneNumber: depositPhoneNumber },
    });

    if (!simPhoneNumber) {
      return NextResponse.json({ error: "Invalid deposit phone number" }, { status: 400 });
    }

    // Check if the user has provided a valid phone number
    const userPhone = phoneNumber || user.phone;

    if (!userPhone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Save the deposit request
    await prisma.deposit.create({
      data: {
        userId,
        simPhoneNumberId: simPhoneNumber.id,
        amount,
      },
    });

    return NextResponse.json({ message: "Deposit request saved successfully" }, { status: 200 });
  } catch (error) {
   if(error instanceof Error){
    return NextResponse.json({ error: error.message }, { status: 500 });
    
   }
   return NextResponse.json({ error: "error.message" }, { status: 500 });
  }
}
