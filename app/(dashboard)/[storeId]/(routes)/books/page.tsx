import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BookColumn } from "./components/columns"
import { BookClient } from "./components/client";

const BooksPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const books = await prismadb.book.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBooks: BookColumn[] = books.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookClient data={formattedBooks} />
      </div>
    </div>
  );
};

export default BooksPage;
