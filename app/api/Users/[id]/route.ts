import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req:NextRequest,res:NextResponse){
    // get user id
    const{searchParams}=new URL(req.url)
    const id=searchParams.get("id")



    if(!id){
        return NextResponse.json({error:"no id",status:404})
    }


    const user=await prisma.user.findUnique({
        where :{id:id}
    })


    if (!user) {
        return NextResponse.json({error:"no such user",status:404})
          
    }


    return NextResponse.json(user)
}