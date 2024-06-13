import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { WriterColumn } from "./components/columns"
import { WriterClient } from "./components/client";

const WritersPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const writers = await prismadb.writer.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedWriters: WriterColumn[] = writers.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <WriterClient data={formattedWriters} />
      </div>
    </div>
  );
};

export default WritersPage;
