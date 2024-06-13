import prismadb from "@/lib/prismadb";

import { AuthorForm } from "./components/author-form";

const AuthorPage = async ({
  params
}: {
  params: { authorId: string, storeId: string }
}) => {
  const author = await prismadb.author.findUnique({
    where: {
      id: params.authorId
    }
  });

  const books = await prismadb.book.findMany({
    where: {
      storeId: params.storeId
    }
  });
  const writers = await prismadb.writer.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AuthorForm books={books} writers={writers} initialData={author} />
      </div>
    </div>
  );
}

export default AuthorPage;
