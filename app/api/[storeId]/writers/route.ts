import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, code } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!code) {
      return new NextResponse("Code is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const writer = await prismadb.writer.create({
      data: {
        name,
        code,
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(writer);
  } catch (error) {
    console.log('[writers_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const writers = await prismadb.writer.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(writers);
  } catch (error) {
    console.log('[writers_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};