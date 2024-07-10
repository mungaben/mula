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

    const config = await prisma.config.findFirst();

    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 500 });
    }

    const minWithdrawalAmount = config.minWithdrawalAmount;
    const withdrawalFeePercentage = config.withdrawalFeePercentage;
    const minBalance = config.minBalance;

    if (amount < minWithdrawalAmount) {
      return NextResponse.json({ error: `Minimum withdrawal amount is Ksh ${minWithdrawalAmount}` }, { status: 400 });
    }

    const withdrawalFee = (amount * withdrawalFeePercentage) / 100;
    const totalDeduction = amount + withdrawalFee;
    const remainingBalance = user.balance - totalDeduction;

    if (remainingBalance < minBalance) {
      return NextResponse.json({ error: `Withdrawal would result in a balance lower than the minimum required Ksh ${minBalance}` }, { status: 400 });
    }

    await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        amount,
        status: 'REQUESTED',
        simPhoneNumberId: simPhoneNumber.id,
      },
    });

    return NextResponse.json({ message: "Withdrawal request created successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
