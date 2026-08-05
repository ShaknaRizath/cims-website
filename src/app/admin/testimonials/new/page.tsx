import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial } from "@/lib/actions/admin/testimonial.actions";

export default async function NewTestimonialPage() {
  const programmes = await prisma.programme.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Testimonial</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Testimonial details</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" programmes={programmes} />
        </CardContent>
      </Card>
    </div>
  );
}
