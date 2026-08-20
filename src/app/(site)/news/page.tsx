import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { NewsCard } from "@/components/marketing/news-card";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "News & Announcements | CIMS Campus",
  description: "Latest news and announcements from CIMS Campus.",
};

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    where: { isPublished: true },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <>
      <PageHero title="News & Announcements" description="The latest updates, announcements, and stories from CIMS Campus." />
      <div className="mx-auto max-w-7xl px-6 py-16">
        {posts.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">No posts published yet.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delayMs={(index % 3) * 100}>
                <NewsCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <CtaBanner />
    </>
  );
}
