import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ProgrammeCategory } from "@/generated/prisma/enums";
import { PROGRAMME_CATEGORY_LABELS } from "@/lib/format/labels";
import { ProgrammeCard } from "@/components/marketing/programme-card";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programmes | CIMS Campus",
  description: "Explore degree and diploma programmes at CIMS Campus across Engineering & Technology, Business & Economics, Law & Education, and Study Abroad pathways.",
};

const CATEGORY_FILTERS = Object.values(ProgrammeCategory);

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = CATEGORY_FILTERS.includes(category as ProgrammeCategory)
    ? (category as ProgrammeCategory)
    : undefined;

  const programmes = await prisma.programme.findMany({
    where: { isPublished: true, ...(activeCategory ? { category: activeCategory } : {}) },
    orderBy: [{ category: "asc" }, { orderIndex: "asc" }],
  });

  return (
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
        {CATEGORY_FILTERS.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            nativeButton={false}
            render={<Link href={`/programmes?category=${cat}`} />}
          >
            {PROGRAMME_CATEGORY_LABELS[cat]}
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
                  category: PROGRAMME_CATEGORY_LABELS[programme.category],
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
  );
}
