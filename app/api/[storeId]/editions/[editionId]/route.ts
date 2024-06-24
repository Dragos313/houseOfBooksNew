import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { editionId: string } }
) {
  try {
    if (!params.editionId) {
      return new NextResponse("Edition id is required", { status: 400 });
    }

    const edition = await prismadb.edition.findUnique({
      where: {
        id: params.editionId
      },
      include: {
        images: true,
        category: true,
        book: true,
        language: true,
        publishingHouse: true
      }
    });
  
    return NextResponse.json(edition);
  } catch (error) {
    console.log('[EDITION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { editionId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.editionId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const edition = await prismadb.edition.delete({
      where: {
        id: params.editionId
      },
    });
  
    return NextResponse.json(edition);
  } catch (error) {
    console.log('[EDITION_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { editionId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, isbn, categoryId, images, bookId, languageId, publishingHouseId, isFeatured, isArchived, isAntiquarian, isAuction } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.editionId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!bookId) {
      return new NextResponse("Book id is required", { status: 400 });
    }

    if (!languageId) {
      return new NextResponse("Language id is required", { status: 400 });
    }
    if (!publishingHouseId) {
      return new NextResponse("Publishing house id is required", { status: 400 });
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

    await prismadb.edition.update({
      where: {
        id: params.editionId
      },
      data: {
        name,
        price,
        categoryId,
        bookId,
        languageId,
        publishingHouseId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
        isAntiquarian,
        isAuction
      },
    });

    const edition = await prismadb.edition.update({
      where: {
        id: params.editionId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    })
  
    return NextResponse.json(edition);
  } catch (error) {
    console.log('[EDITION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
