import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";




// app\api\promotion-requests\[id]\route.ts

// / Handle POST requests for creating promotion requests
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    // Get the number of referrals for the user
    const referees = await prisma.user.findMany({
      where: {
        referredBy: userId,
      },
      select: {
        id: true,
      },
    });

    // Check if the user has at least 5 referrals
    if (referees.length <= 5) {
      return NextResponse.json({ error: 'User does not have enough referrals to become an admin' }, { status: 400 });
    }

    // Create a promotion request
    const promotionRequest = await prisma.promotionRequest.create({
      data: {
        userId,
        status: 'PENDING',
        roleRequested: 'SUBADMIN', // Assuming the role requested is 'SUBADMIN'
      },
    });

    return NextResponse.json(promotionRequest, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}