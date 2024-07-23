import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the path to your prisma client setup

export async function GET(req: NextRequest, { params }: { params: { specialid: string } }) {
    const specialId = params.specialid;
    if (!specialId) {
        return NextResponse.json({ message: "no id passed", status: 401 });
    }
    try {
        const specialCode = await prisma.specialCode.findUnique({
            where: { id: specialId }
        });
        if (!specialCode) {
            return NextResponse.json({ message: "Special code not found", status: 404 });
        }
        return NextResponse.json(specialCode);
    } catch (error) {
        console.error('Error fetching special codes:', error);
        return NextResponse.json({ error: 'An unknown error occurred', status: 400 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { specialid: string } }) {
    const specialId = params.specialid;
    if (!specialId) {
        return NextResponse.json({ message: "no id passed", status: 401 });
    }
    
    try {
        const { code, totalAmount, redeemAmount, expiresAt, userId } = await req.json();
        
        const updatedSpecialCode = await prisma.specialCode.update({
            where: { id: specialId },
            data: {
                code,
                totalAmount,
                redeemAmount,
                expiresAt: new Date(expiresAt),
                userId,
            },
        });
        
        return NextResponse.json(updatedSpecialCode);
    } catch (error) {
        console.error('Error updating special code:', error);
        return NextResponse.json({ error: 'An unknown error occurred', status: 400 });
    }
}
