import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
 // Adjust the import path according to your project structure

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  const { userid } = params;

  try {
    // Find all withdrawal requests for the user
    const withdrawalRequests = await prisma.withdrawalRequest.findMany({
      where: {
        userId: userid,
      },
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

    // Check for unapproved (REQUESTED) withdrawal requests
    const pendingRequests = withdrawalRequests.filter(
      (request) => request.status === 'REQUESTED'
    );

    if (pendingRequests.length > 0) {
      // If there's at least one pending request, return the details of the requests
      return NextResponse.json({
        message: 'Existing withdrawal request found',
        requests: pendingRequests.map((request) => ({
          amount: request.amount,
          time: request.createdAt,
        })),
      }, { status: 200 });
    }

    // If no pending requests, return the user's withdrawal requests
    return NextResponse.json(withdrawalRequests, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
