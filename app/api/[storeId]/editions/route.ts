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

    const { name, isbn, price, categoryId, bookId, languageId, publishingHouseId, images, isFeatured, isArchived, isAntiquarian, isAuction } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Book is required", { status: 400 });
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
      return new NextResponse("Publishing House id is required", { status: 400 });
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

    const edition = await prismadb.edition.create({
      data: {
        name,
        price,
        isbn,
        isFeatured,
        isArchived,
        isAntiquarian,
        categoryId,
        bookId,
        languageId,
        publishingHouseId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(edition);
  } catch (error) {
    console.log('[EDITIONS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const bookId = searchParams.get('bookId') || undefined;
    const languageId = searchParams.get('languageId') || undefined;
    const publishingHouseId = searchParams.get('publishingHouseId') || undefined;
    const isFeatured = searchParams.get('isFeatured');
    const isAntiquarian = searchParams.get('isAntiquarian');
    const isAuction = searchParams.get('isAuction');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const editions = await prismadb.edition.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        bookId,
        languageId,
        publishingHouseId,
        isFeatured: isFeatured ? true : undefined,
        isAntiquarian: isAntiquarian ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        book: true,
        language: true,
        publishingHouse: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(editions);
  } catch (error) {
    console.log('[EDITIONS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
