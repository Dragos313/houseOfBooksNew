import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { authorId: string } }
) {
  try {
    if (!params.authorId) {
      return new NextResponse("author id is required", { status: 400 });
    }

    const author = await prismadb.author.findUnique({
      where: {
        id: params.authorId
      },
      include: {
        book: true,
        writer: true
      }
    });
  
    return NextResponse.json(author);
  } catch (error) {
    console.log('[author_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { authorId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.authorId) {
      return new NextResponse("author id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const author = await prismadb.author.delete({
      where: {
        id: params.authorId,
      }
    });
  
    return NextResponse.json(author);
  } catch (error) {
    console.log('[author_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { authorId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, bookId, writerId } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!bookId) {
      return new NextResponse("Book ID is required", { status: 400 });
    }
    if (!writerId) {
      return new NextResponse("Witer ID is required", { status: 400 });
    }

    if (!params.authorId) {
      return new NextResponse("Author id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const author = await prismadb.author.update({
      where: {
        id: params.authorId,
      },
      data: {
        name,
        bookId,
        writerId
      }
    });
  
    return NextResponse.json(author);
  } catch (error) {
    console.log('[author_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
