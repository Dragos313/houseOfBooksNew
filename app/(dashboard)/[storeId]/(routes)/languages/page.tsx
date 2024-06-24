import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { LanguageColumn } from "./components/columns"
import { LanguageClient } from "./components/client";

const LanguagesPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const languages = await prismadb.language.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const formattedLanguages: LanguageColumn[] = languages.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LanguageClient data={formattedLanguages} />
      </div>
    </div>
  );
};

export default LanguagesPage;
