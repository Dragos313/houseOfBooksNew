import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { writerId: string } }
) {
  try {
    if (!params.writerId) {
      return new NextResponse("Writer id is required", { status: 400 });
    }

    const writer = await prismadb.writer.findUnique({
      where: {
        id: params.writerId
      }
    });
  
    return NextResponse.json(writer);
  } catch (error) {
    console.log('[WRITER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { writerId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.writerId) {
      return new NextResponse("Writer id is required", { status: 400 });
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

    const writer = await prismadb.writer.delete({
      where: {
        id: params.writerId
      }
    });
  
    return NextResponse.json(writer);
  } catch (error) {
    console.log('[WRITER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { writerId: string, storeId: string } }
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


    if (!params.writerId) {
      return new NextResponse("writer id is required", { status: 400 });
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

    const writer = await prismadb.writer.update({
      where: {
        id: params.writerId
      },
      data: {
        name,
        code
      }
    });
  
    return NextResponse.json(writer);
  } catch (error) {
    console.log('[writer_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
