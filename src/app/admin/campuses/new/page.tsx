import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampusForm } from "@/components/admin/campus-form";
import { createCampus } from "@/lib/actions/admin/campus.actions";

export default function NewCampusPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Campus</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Campus details</CardTitle>
        </CardHeader>
        <CardContent>
          <CampusForm action={createCampus} submitLabel="Create campus" />
        </CardContent>
      </Card>
    </div>
  );
}
