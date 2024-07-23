import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, DepositStatus } from "@prisma/client";

import { prisma } from '@/lib/prisma';

type SmsBody = {
  from: string;
  text: string;
  sentStamp: number;
  receivedStamp: number;
  sim: string;
};

const extractDetails = (text: string) => {
  const receivedRegex = /You have received Ksh (\d+\.\d{2}) from MPESA - (.+) (\d+). Txn ID: (\d+)/;
  const sentRegex = /Ksh (\d+\.\d{2}) SENT to (.+) (\d+) on/;

  const receivedMatch = text.match(receivedRegex);
  const sentMatch = text.match(sentRegex);

  if (receivedMatch) {
    const amount = parseFloat(receivedMatch[1]);
    const name = receivedMatch[2];
    const phoneNumber = receivedMatch[3];
    return { type: 'received', name, phoneNumber, amount };
  }

  if (sentMatch) {
    const amount = parseFloat(sentMatch[1]);
    const name = sentMatch[2];
    const phoneNumber = sentMatch[3];
    return { type: 'sent', name, phoneNumber, amount };
  }

  return { type: null, name: null, phoneNumber: null, amount: null };
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("body from sms", { body });

  const sms: SmsBody = body;

  if (!sms) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { from, text, sentStamp, receivedStamp, sim } = sms;

  console.log("from", from);

  if (from.toLowerCase() !== 'airtelmoney') {
    return NextResponse.json({ error: "Invalid sender" }, { status: 400 });
  }

  const { type, name, phoneNumber, amount } = extractDetails(text);
  console.log("extracted details", type, name, phoneNumber, amount);

  if (!type || !name || !phoneNumber || !amount) {
    return NextResponse.json({ error: "Failed to extract details" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (type === 'received') {
      // Check for matching awaiting deposit
      const awaitingDeposit = await prisma.awaitingDeposit.findFirst({
        where: {
          userId: user.id,
          amount,
          simPhoneNumber: { phoneNumber: sim },
          status: DepositStatus.PENDING,
          initiatedAt: {
            gte: new Date(new Date().getTime() - 3 * 60 * 60 * 1000) // within the last 3 hours
          }
        }
      });

      let depositStatus: DepositStatus = DepositStatus.NOT_PREINITIATED_FULFILLED;
      if (awaitingDeposit) {
        // Mark awaiting deposit as fulfilled
        await prisma.awaitingDeposit.update({
          where: { id: awaitingDeposit.id },
          data: { status: DepositStatus.FULFILLED }
        });
        depositStatus = DepositStatus.FULFILLED;
      }

      // Record the deposit
      await prisma.deposit.create({
        data: {
          userId: user.id,
          amount,
          createdAt: new Date(receivedStamp),
          simPhoneNumberId: sim,
          status: depositStatus,
        },
      });

      // Update user balance
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: amount } },
      });

      // Credit pending commissions
      const pendingCommissions = await prisma.commission.findMany({
        where: {
          userId: user.id,
          pending: true,
        },
      });

      for (const commission of pendingCommissions) {
        await prisma.user.update({
          where: { id: commission.referrerId },
          data: { balance: { increment: commission.amount } },
        });

        await prisma.commission.update({
          where: { id: commission.id },
          data: { pending: false },
        });
      }

      return NextResponse.json({ message: "Deposit recorded and balance updated successfully" }, { status: 200 });

    } else if (type === 'sent') {
      // Update user balance to reflect withdrawal
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      });

      return NextResponse.json({ message: "Withdrawal recorded and balance updated successfully" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
