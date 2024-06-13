"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { EditionColumn, columns } from "./columns";

interface EditionsClientProps {
  data: EditionColumn[];
};

export const EditionsClient: React.FC<EditionsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Editions (${data.length})`} description="Manage editions for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/editions/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Editions" />
      <Separator />
      <ApiList entityName="editions" entityIdName="editionsId" />
    </>
  );
};
