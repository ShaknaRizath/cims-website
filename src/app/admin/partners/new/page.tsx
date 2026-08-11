import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerUniversityForm } from "@/components/admin/partner-university-form";
import { createPartnerUniversity } from "@/lib/actions/admin/partner-university.actions";

export default function NewPartnerUniversityPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Partner University</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Partner university details</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnerUniversityForm action={createPartnerUniversity} submitLabel="Create partner university" />
        </CardContent>
      </Card>
    </div>
  );
}
