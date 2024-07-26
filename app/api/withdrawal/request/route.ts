import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";



export async function POST(req: NextRequest) {
  const { userId, amount } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing withdrawal requests with status 'REQUESTED'
    const existingRequest = await prisma.withdrawalRequest.findFirst({
      where: {
        userId,
        status: 'REQUESTED',
      },
    });

    if (existingRequest) {
      return NextResponse.json({
        error: `Existing withdrawal request found: Amount Ksh ${existingRequest.amount}, Requested at ${existingRequest.createdAt}`,
      }, { status: 400 });
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

// Read all withdrawal requests
export async function GET(req: NextRequest) {
  try {
    const withdrawalRequests = await prisma.withdrawalRequest.findMany({
      include: {
        user: {
          include: {
            deposits: true,
            interests: true,
            commissionsReceived: true,
            commissionsGiven: true,
          },
        },
      },
    });
    return NextResponse.json(withdrawalRequests, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// Update a withdrawal request
export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();

  try {
    const withdrawalRequest = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(withdrawalRequest, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// Delete a withdrawal request
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    await prisma.withdrawalRequest.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Withdrawal request deleted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
