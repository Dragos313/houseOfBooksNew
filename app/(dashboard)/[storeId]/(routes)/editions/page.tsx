import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { EditionsClient } from "./components/client";
import { EditionColumn } from "./components/columns";

const EditionsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const editions = await prismadb.edition.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      publishingHouse: true,
      book: true,
      language: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedEditions: EditionColumn[] = editions.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    publishingHouse: item.publishingHouse.name,
    book: item.book.name,
    language: item.language.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EditionsClient data={formattedEditions} />
      </div>
    </div>
  );
};

export default EditionsPage;
