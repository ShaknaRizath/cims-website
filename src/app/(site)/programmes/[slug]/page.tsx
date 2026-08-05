import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Download, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { PROGRAMME_CATEGORY_LABELS } from "@/lib/format/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { TestimonialCard } from "@/components/marketing/testimonial-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const programme = await prisma.programme.findUnique({ where: { slug } });
  if (!programme) return {};
  return {
    title: `${programme.name} | CIMS Campus`,
    description: programme.summary,
  };
}

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const programme = await prisma.programme.findUnique({
    where: { slug },
    include: {
      testimonials: {
        where: { isPublished: true },
        orderBy: { orderIndex: "asc" },
        take: 3,
      },
    },
  });

  if (!programme || !programme.isPublished) notFound();

  const highlights = Array.isArray(programme.highlights) ? (programme.highlights as string[]) : [];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        {programme.heroImageUrl && (
          <Image
            src={programme.heroImageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-25"
          />
        )}
        <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-6 py-20">
          <Reveal>
            <Badge variant="secondary" className="w-fit">
              {PROGRAMME_CATEGORY_LABELS[programme.category]}
            </Badge>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="font-heading text-3xl font-bold sm:text-5xl">{programme.name}</h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="max-w-2xl text-lg text-primary-foreground/80">{programme.summary}</p>
          </Reveal>
          <Reveal delayMs={300}>
            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
              {programme.level && <span>{programme.level}</span>}
              {programme.durationText && <span>· {programme.durationText}</span>}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold text-foreground">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{programme.description}</p>
          </Reveal>

          {highlights.length > 0 && (
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">Highlights</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {programme.entryRequirements && (
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">Entry Requirements</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{programme.entryRequirements}</p>
            </Reveal>
          )}

          {programme.careerOutcomes && (
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">Career Outcomes</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{programme.careerOutcomes}</p>
            </Reveal>
          )}
        </div>

        <Reveal className="lg:col-start-3">
          <Card className="sticky top-24 gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <div className="font-heading font-semibold text-foreground">{programme.level || "Programme"}</div>
                <div className="text-sm text-muted-foreground">{programme.durationText}</div>
              </div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" nativeButton={false} render={<Link href="/apply" />}>
              Apply Now
            </Button>
            {programme.brochureFileUrl && (
              <Button variant="outline" className="w-full gap-2" nativeButton={false} render={<Link href={programme.brochureFileUrl} target="_blank" />}>
                <Download className="size-4" /> Download Brochure
              </Button>
            )}
          </Card>
        </Reveal>
      </section>

      {programme.testimonials.length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">What Our Graduates Say</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programme.testimonials.map((testimonial, index) => (
                <Reveal key={testimonial.id} delayMs={index * 100}>
                  <TestimonialCard
                    testimonial={{
                      studentName: testimonial.studentName,
                      programmeName: programme.name,
                      batchYear: testimonial.batchYear,
                      quote: testimonial.quote,
                      photoUrl: testimonial.photoUrl,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 py-10">
        <Button variant="outline" nativeButton={false} render={<Link href="/programmes" />}>
          View All Programmes <ArrowRight className="size-4" />
        </Button>
      </section>

      <CtaBanner />
    </>
  );
}
