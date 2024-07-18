import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  earningPer24Hours: z.number().positive(),
  growthPercentage: z.number().positive(),
  subscribersCount: z.number().int().nonnegative(),
});
// req: NextRequest,{ params }: { params: { id: string } }

export async function GET(req: NextRequest,{params}:{params:{id:string}}) {
  const { searchParams } = new URL(req.url);
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "No id passed in params" }, { status: 404 });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching product" }, { status: 500 });
  }
}

export async function POST(req: NextRequest,{params}:{params:{id:string}}) {
  try {
    const body = await req.json();
    const parsedBody = productSchema.parse(body);

    const newProduct = await prisma.product.create({
      data: parsedBody,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest,{params}:{params:{id:string}}) {
  const { searchParams } = new URL(req.url);
  const id = params.id;
  console.log("id",id);
  

  if (!id) {
    return NextResponse.json({ error: "No id passed in params" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsedBody = productSchema.partial().parse(body);

    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: parsedBody,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "No id passed in params" }, { status: 404 });
  }

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
