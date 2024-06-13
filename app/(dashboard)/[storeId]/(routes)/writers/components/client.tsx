"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, WriterColumn } from "./columns";

interface WritersClientProps {
  data: WriterColumn[];
}

export const WriterClient: React.FC<WritersClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Writers (${data.length})`} description="Manage writers for your products" />
        <Button onClick={() => router.push(`/${params.storeId}/writers/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for writers" />
      <Separator />
      <ApiList entityName="writers" entityIdName="writerId" />
    </>
  );
};
