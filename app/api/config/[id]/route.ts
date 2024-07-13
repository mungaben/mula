import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const getIdFromRequest = (req: NextRequest) => {
  const { pathname } = new URL(req.url!);
  const parts = pathname.split('/');
  return parts[parts.length - 1];
};

export async function GET(req: NextRequest) {
  const id = getIdFromRequest(req);

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const config = await prisma.config.findUnique({
      where: { id },
    });

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // const id = getIdFromRequest(req);
  const updatedData = await req.json();

  // if (!id) {
  //   return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  // }

  try {
    // Fetch the existing configuration
    // const existingConfig = await prisma.config.findUnique({
    //   where: { id },
    // });

    // if (!existingConfig) {
    //   return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    // }

    // Merge existing data with updated data
    // const data = { ...existingConfig, ...updatedData, updatedAt: new Date() };

    const config = await prisma.config.update({
      ...updatedData,
    });

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromRequest(req);

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.config.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Configuration deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
