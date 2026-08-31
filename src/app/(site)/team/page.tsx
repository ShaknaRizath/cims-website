import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { TeamCategory } from "@/generated/prisma/enums";
import { TEAM_CATEGORY_LABELS } from "@/lib/format/labels";
import { TeamMemberCard } from "@/components/marketing/team-member-card";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Team | CIMS Campus",
  description: "Meet the Board of Governors, Academic Board, Academic Panel, and International Representatives at CIMS Campus.",
};

const CATEGORIES = Object.values(TeamCategory);

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = CATEGORIES.includes(category as TeamCategory) ? (category as TeamCategory) : undefined;

  const members = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: [{ category: "asc" }, { orderIndex: "asc" }],
  });

  const groups = (activeCategory ? [activeCategory] : CATEGORIES).map((cat) => ({
    category: cat,
    label: TEAM_CATEGORY_LABELS[cat],
    members: members.filter((member) => member.category === cat),
  }));

  return (
    <>
      <PageHero
        title="Leadership & Representatives"
        description="Meet the Board of Governors, Academic Board, Academic Panel, and International Representatives leading CIMS Campus."
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant={!activeCategory ? "default" : "outline"} size="sm" nativeButton={false} render={<Link href="/team" />}>
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              nativeButton={false}
              render={<Link href={`/team?category=${cat}`} />}
            >
              {TEAM_CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>

        {groups.map((group) => (
          <section key={group.category} className="mt-16 first:mt-12">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-foreground">{group.label}</h2>
            </Reveal>
            {group.members.length === 0 ? (
              <p className="mt-4 text-muted-foreground">No members listed yet.</p>
            ) : (
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                {group.members.map((member, index) => (
                  <Reveal
                    key={member.id}
                    delayMs={(index % 3) * 100}
                    className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <TeamMemberCard member={member} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <CtaBanner />
    </>
  );
}
