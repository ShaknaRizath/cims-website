import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgrammeCategoryForm } from "@/components/admin/programme-category-form";
import { createProgrammeCategory } from "@/lib/actions/admin/programme-category.actions";

export default function NewProgrammeCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Category</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgrammeCategoryForm action={createProgrammeCategory} submitLabel="Create category" />
        </CardContent>
      </Card>
    </div>
  );
}
