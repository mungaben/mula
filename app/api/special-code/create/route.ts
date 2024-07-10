import { createSpecialCode, getActiveSpecialCodes, getAllSpecialCodes } from "@/app/server-actions/specialCodeActions";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/configs/auth/authOptions";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID not found' }), { status: 400 });
  }

  const data = await req.json();
  
  // Ensure expiresAt is a Date object
  if (data.expiresAt) {
    data.expiresAt = new Date(data.expiresAt);
  }

  // Add userId to the data
  data.userId = userId;

  console.log("log create special", data);

  try {
    const specialCode = await createSpecialCode(data);
    return new Response(JSON.stringify(specialCode), { status: 201 });
  } catch (error) {
    console.error('Error creating special code:', error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("url", searchParams);
    
    const fetchAll = searchParams.get('all');
    console.log("fetchall", fetchAll);

    if (fetchAll) {
      const allSpecialCodes = await getAllSpecialCodes();
      console.log("allspecialodes", allSpecialCodes);
      return NextResponse.json(allSpecialCodes, { status: 200 });
    } else {
      const activeSpecialCodes = await getActiveSpecialCodes();
      console.log("logall active", activeSpecialCodes);
      return NextResponse.json(activeSpecialCodes, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching special codes:', error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 400 });
  }
}
