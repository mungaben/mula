import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest,res:NextResponse){
    const body= await req.json()

    console.log("body from sms",{body})



    return NextResponse.json({
        message:body
    })
}