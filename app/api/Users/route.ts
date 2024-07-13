import authOptions from "@/lib/configs/auth/authOptions";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req:NextRequest){
    // get user seesion 



    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
    
    return NextResponse.json({ session }, { status: 200 });



    





}