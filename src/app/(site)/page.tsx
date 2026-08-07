import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, GraduationCap, Users, BookOpen } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { ProgrammeCard } from "@/components/marketing/programme-card";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { NewsCard } from "@/components/marketing/news-card";
import { PROGRAMME_CATEGORY_LABELS } from "@/lib/format/labels";

const stats = [
  { label: "Years of Excellence", value: "18+", icon: BadgeCheck },
  { label: "Graduates", value: "10,000+", icon: GraduationCap },
  { label: "Degree Programmes", value: "20+", icon: BookOpen },
  { label: "Industry Partners", value: "50+", icon: Users },
];

export default async function Home() {
  const [settings, featuredProgrammes, featuredTestimonials, latestPosts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.programme.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { orderIndex: "asc" },
      take: 4,
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { orderIndex: "asc" },
      take: 3,
      include: { programme: { select: { name: true } } },
    }),
    prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 3,
    }),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        {settings?.heroImageUrl && (
          <Image src={settings.heroImageUrl} alt="" fill unoptimized className="object-cover opacity-25" />
        )}
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
          <Reveal>
            <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium">
              Est. 2006 · Colombo, Sri Lanka
            </span>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-6xl">
              {settings?.heroHeadline ?? "Your Faster Route to Higher Education"}
            </h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="max-w-2xl text-lg text-primary-foreground/80">
              {settings?.heroSubheadline ??
                "Degree programmes and vocational training recognized worldwide — in Engineering & Technology, Business & Economics, and Law & Education."}
            </p>
          </Reveal>
          <Reveal delayMs={300}>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                nativeButton={false}
                render={<Link href="/apply" />}
              >
                Apply Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                nativeButton={false}
                render={<Link href="/programmes" />}
              >
                Explore Programmes <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b bg-secondary/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delayMs={index * 80} className="flex flex-col items-center gap-2 text-center">
              <stat.icon className="size-6 text-primary" />
              <span className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="flex flex-col gap-3 text-center">
          <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">
            Programmes
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Find the Right Path for You
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our degree and diploma programmes across four schools, each designed with industry input
            and clear career outcomes.
          </p>
        </Reveal>
        {featuredProgrammes.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProgrammes.map((programme, index) => (
              <Reveal key={programme.id} delayMs={index * 100}>
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
        <Reveal className="mt-10 flex justify-center">
          <Button variant="outline" nativeButton={false} render={<Link href="/programmes" />}>
            View All Programmes <ArrowRight className="size-4" />
          </Button>
        </Reveal>
      </section>

      {featuredTestimonials.length > 0 && (
        <section className="bg-secondary/40 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="flex flex-col gap-3 text-center">
              <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">
                Success Stories
              </span>
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Hear From Our Graduates
              </h2>
            </Reveal>
            <Reveal className="mt-12">
              <TestimonialCarousel
                testimonials={featuredTestimonials.map((testimonial) => ({
                  studentName: testimonial.studentName,
                  programmeName: testimonial.programme?.name,
                  batchYear: testimonial.batchYear,
                  quote: testimonial.quote,
                  photoUrl: testimonial.photoUrl,
                }))}
              />
            </Reveal>
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <Reveal className="flex flex-col gap-3 text-center">
            <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">News</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Latest Updates</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
              <Reveal key={post.id} delayMs={index * 100}>
                <NewsCard post={post} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex justify-center">
            <Button variant="outline" nativeButton={false} render={<Link href="/news" />}>
              View All News <ArrowRight className="size-4" />
            </Button>
          </Reveal>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
