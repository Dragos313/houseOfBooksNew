import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { languageId: string } }
) {
  try {
    if (!params.languageId) {
      return new NextResponse("language id is required", { status: 400 });
    }

    const language = await prismadb.language.findUnique({
      where: {
        id: params.languageId
      }
    });
  
    return NextResponse.json(language);
  } catch (error) {
    console.log('[language_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { languageId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.languageId) {
      return new NextResponse("language id is required", { status: 400 });
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

    const language = await prismadb.language.delete({
      where: {
        id: params.languageId
      }
    });
  
    return NextResponse.json(language);
  } catch (error) {
    console.log('[language_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { languageId: string, storeId: string } }
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


    if (!params.languageId) {
      return new NextResponse("language id is required", { status: 400 });
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

    const language = await prismadb.language.update({
      where: {
        id: params.languageId
      },
      data: {
        name,
        code
      }
    });
  
    return NextResponse.json(language);
  } catch (error) {
    console.log('[language_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
