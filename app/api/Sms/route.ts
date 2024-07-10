import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

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

  const sms: SmsBody = body.body;

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
      // Handle deposit
      await prisma.deposit.create({
        data: {
          userId: user.id,
          amount,
          createdAt: new Date(receivedStamp),
          simPhoneNumberId: sim, // Include simPhoneNumberId
        },
      });

      // Update user balance
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: amount } },
      });

      return NextResponse.json({ message: "Deposit recorded and balance updated successfully" }, { status: 200 });

    } else if (type === 'sent') {
      // Handle withdrawal
      const withdrawal = await prisma.withdrawalRequest.create({
        data: {
          userId: user.id,
          amount,
          status: 'APPROVED',
          createdAt: new Date(receivedStamp),
          simPhoneNumberId: sim, // Ensure this field is included
        },
      });

      // Update user balance
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
