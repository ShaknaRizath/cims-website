import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateTestimonial, deleteTestimonial } from "@/lib/actions/admin/testimonial.actions";

export default async function TestimonialDetailPage({
  params,
}: {
  params: Promise<{ testimonialId: string }>;
}) {
  const { testimonialId } = await params;

  const [testimonial, programmes] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id: testimonialId } }),
    prisma.programme.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!testimonial) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{testimonial.studentName}</h1>
        <DeleteConfirmButton
          action={deleteTestimonial.bind(null, testimonial.id)}
          title={`Delete testimonial from ${testimonial.studentName}?`}
          description="This permanently deletes the testimonial. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm
            action={updateTestimonial.bind(null, testimonial.id)}
            defaultValues={testimonial}
            submitLabel="Save changes"
            programmes={programmes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
