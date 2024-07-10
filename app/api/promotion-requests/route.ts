import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests
export async function GET(req: NextRequest) {
  try {
    const promotionRequests = await prisma.promotionRequest.findMany({
      include: {
        user: true, // Include user details
      },
    });

    return NextResponse.json(promotionRequests, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Handle PUT requests
export async function PUT(req: NextRequest) {
  try {
    const { requestId, status } = await req.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const promotionRequest = await prisma.promotionRequest.findUnique({
      where: { id: requestId },
    });

    if (!promotionRequest || promotionRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invalid or already processed request' }, { status: 400 });
    }

    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: promotionRequest.userId },
        data: { role: 'SUBADMIN' },
      });
    }

    await prisma.promotionRequest.update({
      where: { id: requestId },
      data: { status },
    });

    return NextResponse.json({ message: 'Promotion request updated' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
