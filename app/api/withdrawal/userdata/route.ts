

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";






// Read all withdrawal requests
export async function GET(req: NextRequest) {
    try {
      const withdrawalRequests = await prisma.withdrawalRequest.findMany({
        include:{
          user:{
            select:{
              phone:true
            }
            
          }
        }
      });
      return NextResponse.json(withdrawalRequests, { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
  }
  