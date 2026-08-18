import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Success Stories | CIMS Campus",
  description: "Hear from CIMS Campus graduates about their careers and experience.",
};

export default async function SuccessStoriesPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { orderIndex: "asc" },
    include: { programme: { select: { name: true } } },
  });

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">Success Stories</span>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Hear From Our Graduates</h1>
        </Reveal>

        {testimonials.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">Testimonials coming soon.</p>
        ) : (
          <div className="mt-24 grid gap-x-6 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delayMs={(index % 3) * 100}>
                <TestimonialCard
                  testimonial={{
                    studentName: testimonial.studentName,
                    programmeName: testimonial.programme?.name,
                    batchYear: testimonial.batchYear,
                    quote: testimonial.quote,
                    photoUrl: testimonial.photoUrl,
                  }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <CtaBanner />
    </>
  );
}
