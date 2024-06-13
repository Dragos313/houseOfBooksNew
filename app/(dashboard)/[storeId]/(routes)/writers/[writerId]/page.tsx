import prismadb from "@/lib/prismadb";

import { WriterForm } from "./components/writer-form";

const WriterPage = async ({
  params
}: {
  params: { writerId: string }
}) => {
  const writer = await prismadb.writer.findUnique({
    where: {
      id: params.writerId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <WriterForm initialData={writer} />
      </div>
    </div>
  );
}

export default WriterPage;
