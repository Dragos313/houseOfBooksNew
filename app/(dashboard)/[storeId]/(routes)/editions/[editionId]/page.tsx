import prismadb from "@/lib/prismadb";

import { EditionForm } from "./components/edition-form";

const EditionPage = async ({
  params
}: {
  params: { editionId: string, storeId: string }
}) => {
  const edition = await prismadb.edition.findUnique({
    where: {
      id: params.editionId,
    },
    include: {
      images: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const books = await prismadb.book.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const publishingHouses = await prismadb.publishingHouse.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const languages = await prismadb.language.findMany();

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EditionForm 
          categories={categories}
          books={books}
          publishingHouses={publishingHouses}
          languages={languages}
          initialData={edition}
        />
      </div>
    </div>
  );
}

export default EditionPage;
