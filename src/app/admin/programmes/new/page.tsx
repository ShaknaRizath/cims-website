import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgrammeForm } from "@/components/admin/programme-form";
import { createProgramme } from "@/lib/actions/admin/programme.actions";

export default function NewProgrammePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Programme</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Programme details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgrammeForm action={createProgramme} submitLabel="Create programme" />
        </CardContent>
      </Card>
    </div>
  );
}
