import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateHeroSlide, deleteHeroSlide } from "@/lib/actions/admin/hero-slide.actions";

export default async function HeroSlideDetailPage({
  params,
}: {
  params: Promise<{ slideId: string }>;
}) {
  const { slideId } = await params;

  const slide = await prisma.heroSlide.findUnique({ where: { id: slideId } });
  if (!slide) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Hero Slide</h1>
        <DeleteConfirmButton
          action={deleteHeroSlide.bind(null, slide.id)}
          title="Delete this hero slide?"
          description="This permanently deletes the hero slide. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit hero slide</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroSlideForm
            action={updateHeroSlide.bind(null, slide.id)}
            defaultValues={slide}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
