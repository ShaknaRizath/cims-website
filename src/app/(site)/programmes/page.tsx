import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ProgrammeCard } from "@/components/marketing/programme-card";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programmes | CIMS Campus",
  description: "Explore degree and diploma programmes at CIMS Campus across Engineering & Technology, Business & Economics, Law & Education, and Study Abroad pathways.",
};

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const categories = await prisma.programmeCategory.findMany({ orderBy: { orderIndex: "asc" } });
  const activeCategory = categories.find((c) => c.slug === category);

  const programmes = await prisma.programme.findMany({
    where: { isPublished: true, ...(activeCategory ? { categoryId: activeCategory.id } : {}) },
    orderBy: [{ category: { orderIndex: "asc" } }, { orderIndex: "asc" }],
    include: { category: { select: { name: true } } },
  });

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">Programmes</span>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Find the Right Path for You</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our degree and diploma programmes across four schools, each designed with industry input and clear career outcomes.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={!activeCategory ? "default" : "outline"}
            size="sm"
            nativeButton={false}
            render={<Link href="/programmes" />}
          >
            All Programmes
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory?.id === cat.id ? "default" : "outline"}
              size="sm"
              nativeButton={false}
              render={<Link href={`/programmes?category=${cat.slug}`} />}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {programmes.length === 0 ? (
          <p className={cn("mt-16 text-center text-muted-foreground")}>
            No programmes found in this category yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme, index) => (
              <Reveal key={programme.id} delayMs={(index % 3) * 100}>
                <ProgrammeCard
                  programme={{
                    slug: programme.slug,
                    name: programme.name,
                    category: programme.category.name,
                    level: programme.level ?? "",
                    durationText: programme.durationText ?? "",
                    summary: programme.summary,
                    heroImageUrl: programme.heroImageUrl,
                  }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <CtaBanner
        headline="Not sure which programme fits you?"
        subtext="Talk to our admissions team — we'll help you find the right path based on your goals and background."
      />
    </>
  );
}
