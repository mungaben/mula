import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { prisma } from '@/lib/prisma';

const addPhoneNumberSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
  description: z.string().optional().default("No description provided"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = addPhoneNumberSchema.parse(body);

    const { phoneNumber, description } = parsedBody;

    // Check if the phone number already exists
    const existingPhoneNumber = await prisma.simPhoneNumber.findUnique({
      where: { phoneNumber },
    });

    if (existingPhoneNumber) {
      return NextResponse.json({ error: "Phone number already exists" }, { status: 400 });
    }

    // Add new phone number
    const newPhoneNumber = await prisma.simPhoneNumber.create({
      data: {
        phoneNumber,
        description,
      },
    });

    return NextResponse.json(newPhoneNumber, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phoneNumber = searchParams.get('phoneNumber');

  if (!phoneNumber) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const phoneDetails = await prisma.simPhoneNumber.findUnique({
      where: { phoneNumber },
      include: {
        deposits: true,
        awaitingDeposits: true,
        withdrawals: true,
      },
    });

    if (!phoneDetails) {
      return NextResponse.json({ error: "Phone number not found" }, { status: 404 });
    }

    return NextResponse.json(phoneDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



const updatePhoneNumberSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
  description: z.string().optional(),
});



export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = updatePhoneNumberSchema.parse(body);

    const { phoneNumber, description } = parsedBody;

    const existingPhoneNumber = await prisma.simPhoneNumber.findUnique({
      where: { phoneNumber },
    });

    if (!existingPhoneNumber) {
      return NextResponse.json({ error: "Phone number not found" }, { status: 404 });
    }

    const updatedPhoneNumber = await prisma.simPhoneNumber.update({
      where: { phoneNumber },
      data: {
        description: description ?? existingPhoneNumber.description,
      },
    });

    return NextResponse.json(updatedPhoneNumber, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phoneNumber = searchParams.get('phoneNumber');

  if (!phoneNumber) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const existingPhoneNumber = await prisma.simPhoneNumber.findUnique({
      where: { phoneNumber },
    });

    if (!existingPhoneNumber) {
      return NextResponse.json({ error: "Phone number not found" }, { status: 404 });
    }

    await prisma.simPhoneNumber.delete({
      where: { phoneNumber },
    });

    return NextResponse.json({ message: "Phone number deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}