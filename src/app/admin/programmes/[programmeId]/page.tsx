import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgrammeForm } from "@/components/admin/programme-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateProgramme, deleteProgramme } from "@/lib/actions/admin/programme.actions";

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ programmeId: string }>;
}) {
  const { programmeId } = await params;

  const [programme, categories] = await Promise.all([
    prisma.programme.findUnique({ where: { id: programmeId } }),
    prisma.programmeCategory.findMany({ select: { id: true, name: true }, orderBy: { orderIndex: "asc" } }),
  ]);
  if (!programme) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{programme.name}</h1>
        <DeleteConfirmButton
          action={deleteProgramme.bind(null, programme.id)}
          title={`Delete ${programme.name}?`}
          description="This permanently deletes the programme. Testimonials referencing it will keep their row but lose the programme link. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit programme</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgrammeForm
            action={updateProgramme.bind(null, programme.id)}
            defaultValues={programme}
            submitLabel="Save changes"
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
