"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, LanguageColumn } from "./columns";

interface LanguagesClientProps {
  data: LanguageColumn[];
}

export const LanguageClient: React.FC<LanguagesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Languages (${data.length})`} description="Manage languages" />
        <Button onClick={() => router.push(`/${params.storeId}/languages/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for languages" />
      <Separator />
      <ApiList entityName="languages" entityIdName="languageId" />
    </>
  );
};
