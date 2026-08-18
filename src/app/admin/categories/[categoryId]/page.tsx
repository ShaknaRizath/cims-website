import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgrammeCategoryForm } from "@/components/admin/programme-category-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateProgrammeCategory, deleteProgrammeCategory } from "@/lib/actions/admin/programme-category.actions";

export default async function ProgrammeCategoryDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  const category = await prisma.programmeCategory.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { programmes: true } } },
  });
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{category.name}</h1>
        <DeleteConfirmButton
          action={deleteProgrammeCategory.bind(null, category.id)}
          title={`Delete ${category.name}?`}
          description={
            category._count.programmes > 0
              ? `${category._count.programmes} programme(s) currently use this category. Reassign or delete them first.`
              : "This permanently deletes the category. This cannot be undone."
          }
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit category</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgrammeCategoryForm
            action={updateProgrammeCategory.bind(null, category.id)}
            defaultValues={category}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
