"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type EditionColumn = {
  id: string
  name: string;
  price: string;
  category: string;
  publishingHouse: string;
  book: string;
  language: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
  isAntiquarian: boolean;
}

export const columns: ColumnDef<EditionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isAntiquarian",
    header: "Old Book",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "book",
    header: "Book",
  },
  {
    accessorKey: "language",
    header: "Language",
  },
  {
    accessorKey: "publishingHouse",
    header: "Publishing House",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
