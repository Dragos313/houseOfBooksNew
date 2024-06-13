import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    if (!params.bookId) {
      return new NextResponse("book id is required", { status: 400 });
    }

    const book = await prismadb.book.findUnique({
      where: {
        id: params.bookId
      }
    });
  
    return NextResponse.json(book);
  } catch (error) {
    console.log('[book_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { bookId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.bookId) {
      return new NextResponse("book id is required", { status: 400 });
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

    const book = await prismadb.book.delete({
      where: {
        id: params.bookId
      }
    });
  
    return NextResponse.json(book);
  } catch (error) {
    console.log('[book_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { bookId: string, storeId: string } }
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


    if (!params.bookId) {
      return new NextResponse("book id is required", { status: 400 });
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

    const book = await prismadb.book.update({
      where: {
        id: params.bookId
      },
      data: {
        name,
        code
      }
    });
  
    return NextResponse.json(book);
  } catch (error) {
    console.log('[book_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
