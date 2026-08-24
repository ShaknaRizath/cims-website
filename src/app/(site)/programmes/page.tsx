import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ProgrammeCard } from "@/components/marketing/programme-card";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
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
    where: {
      isPublished: true,
      ...(activeCategory ? { categories: { some: { id: activeCategory.id } } } : {}),
    },
    orderBy: { orderIndex: "asc" },
    include: { categories: { select: { name: true }, orderBy: { orderIndex: "asc" } } },
  });

  return (
    <>
      <PageHero
        title="Find the Right Path for You"
        description="Explore our Degree and Diploma programmes across three Faculties, each designed with industry input and clear career outcomes."
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap justify-center gap-2">
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
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {programmes.map((programme, index) => (
              <Reveal
                key={programme.id}
                delayMs={(index % 3) * 100}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <ProgrammeCard
                  programme={{
                    slug: programme.slug,
                    name: programme.name,
                    category: programme.categories[0]?.name ?? "",
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
