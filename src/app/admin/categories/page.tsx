import Link from "next/link";
import { Tag } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminCategoriesPage() {
  const categories = await prisma.programmeCategory.findMany({
    orderBy: [{ orderIndex: "asc" }],
    include: { _count: { select: { programmes: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Programme categories used across the site and in the Programmes admin."
        newLabel="New Category"
        newHref="/admin/categories/new"
      />
      {categories.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Tag />
            </EmptyMedia>
            <EmptyTitle>No categories yet</EmptyTitle>
            <EmptyDescription>Categories you add will be selectable when creating programmes.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Programmes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/categories/${category.id}`} className="hover:underline">
                    {category.name}
                  </Link>
                </TableCell>
                <TableCell>{category._count.programmes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
