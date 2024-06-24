import prismadb from "@/lib/prismadb";

import { LanguageForm } from "./components/book-form";

const LanguagePage = async ({
  params
}: {
  params: { languageId: string }
}) => {
  const language = await prismadb.language.findUnique({
    where: {
      id: params.languageId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <LanguageForm initialData={language} />
      </div>
    </div>
  );
}

export default LanguagePage;
