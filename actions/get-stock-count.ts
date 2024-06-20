import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
    const salesCount = await prismadb.edition.count({
        where: {
            storeId,
            isArchived: false,
        }
    });

    return salesCount;
}