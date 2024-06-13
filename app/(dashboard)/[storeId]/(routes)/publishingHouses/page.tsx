import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { PublishingHousesColumn } from "./components/columns"
import { PublishingHousesClient } from "./components/client";

const PublishingHousesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const publishingHouses = await prismadb.publishingHouse.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedPublishingHouses: PublishingHousesColumn[] = publishingHouses.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PublishingHousesClient data={formattedPublishingHouses} />
      </div>
    </div>
  );
};

export default PublishingHousesPage;
