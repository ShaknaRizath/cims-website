import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { createHeroSlide } from "@/lib/actions/admin/hero-slide.actions";

export default function NewHeroSlidePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Hero Slide</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Hero slide details</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroSlideForm action={createHeroSlide} submitLabel="Create hero slide" />
        </CardContent>
      </Card>
    </div>
  );
}
