import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerUniversityForm } from "@/components/admin/partner-university-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updatePartnerUniversity, deletePartnerUniversity } from "@/lib/actions/admin/partner-university.actions";

export default async function PartnerUniversityDetailPage({
  params,
}: {
  params: Promise<{ partnerId: string }>;
}) {
  const { partnerId } = await params;

  const partner = await prisma.partnerUniversity.findUnique({ where: { id: partnerId } });
  if (!partner) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{partner.name}</h1>
        <DeleteConfirmButton
          action={deletePartnerUniversity.bind(null, partner.id)}
          title={`Delete ${partner.name}?`}
          description="This permanently deletes the partner university. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit partner university</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnerUniversityForm
            action={updatePartnerUniversity.bind(null, partner.id)}
            defaultValues={partner}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
