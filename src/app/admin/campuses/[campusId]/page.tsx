import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampusForm } from "@/components/admin/campus-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateCampus, deleteCampus } from "@/lib/actions/admin/campus.actions";

export default async function CampusDetailPage({
  params,
}: {
  params: Promise<{ campusId: string }>;
}) {
  const { campusId } = await params;

  const campus = await prisma.campusLocation.findUnique({ where: { id: campusId } });
  if (!campus) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{campus.name}</h1>
        <DeleteConfirmButton
          action={deleteCampus.bind(null, campus.id)}
          title={`Delete ${campus.name}?`}
          description="This permanently deletes the campus location. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit campus</CardTitle>
        </CardHeader>
        <CardContent>
          <CampusForm
            action={updateCampus.bind(null, campus.id)}
            defaultValues={campus}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
