import prismadb from "@/lib/prismadb";

import { PublishingHousesForm } from "./components/publishingHouse-form";

const PublishingHousesPage = async ({
  params
}: {
  params: { publishingHouseId: string }
}) => {
  const publishingHouse = await prismadb.publishingHouse.findUnique({
    where: {
      id: params.publishingHouseId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PublishingHousesForm initialData={publishingHouse} />
      </div>
    </div>
  );
}

export default PublishingHousesPage;
