import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { publishingHouseId: string } }
) {
  try {
    if (!params.publishingHouseId) {
      return new NextResponse("publishingHouse id is required", { status: 400 });
    }

    const publishingHouse = await prismadb.publishingHouse.findUnique({
      where: {
        id: params.publishingHouseId
      }
    });
  
    return NextResponse.json(publishingHouse);
  } catch (error) {
    console.log('[publishingHouse_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { publishingHouseId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.publishingHouseId) {
      return new NextResponse("publishingHouse id is required", { status: 400 });
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

    const publishingHouse = await prismadb.publishingHouse.delete({
      where: {
        id: params.publishingHouseId
      }
    });
  
    return NextResponse.json(publishingHouse);
  } catch (error) {
    console.log('[publishingHouse_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, publishingHouseId: string } }
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


    if (!params.publishingHouseId) {
      return new NextResponse("PublishingHouse id is required", { status: 400 });
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

    const publishingHouse = await prismadb.publishingHouse.update({
      where: {
        id: params.publishingHouseId
      },
      data: {
        name,
        code
      }
    });
  
    return NextResponse.json(publishingHouse);
  } catch (error) {
    console.log('[publishingHouse_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
