import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, GraduationCap, Landmark, Users, BookOpen } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { ProgrammeCard } from "@/components/marketing/programme-card";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { PartnerUniversityCarousel } from "@/components/marketing/partner-university-carousel";
import { NewsEventsPanel, type FeedItem } from "@/components/marketing/news-events-panel";
import { EventsCalendar } from "@/components/marketing/events-calendar";
import { HeroSlider } from "@/components/marketing/hero-slider";
import { ContactSection } from "@/components/marketing/contact-section";

const stats = [
  { label: "Years of Excellence", value: "14+", icon: BadgeCheck },
  { label: "Passed Out Students", value: "10,000+", icon: GraduationCap },
  { label: "UGC Recognized Degrees", value: "20", icon: BookOpen },
  { label: "University Affiliations", value: "5", icon: Landmark },
  { label: "Industry Partners", value: "50+", icon: Users },
];

export default async function Home() {
  const [settings, featuredProgrammes, featuredTestimonials, partners, latestPosts, events, heroSlides] =
    await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.programme.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { orderIndex: "asc" },
      take: 4,
      include: { category: { select: { name: true } } },
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { orderIndex: "asc" },
      take: 3,
      include: { programme: { select: { name: true } } },
    }),
    prisma.partnerUniversity.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
    }),
    prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 3,
    }),
    prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startAt: "asc" },
    }),
    prisma.heroSlide.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
    }),
  ]);

  const now = new Date();
  const upcomingEvents = events.filter((event) => event.startAt >= now);

  const feedItems: FeedItem[] = [
    ...latestPosts.map((post) => ({
      type: "news" as const,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.publishedAt,
    })),
    ...upcomingEvents.map((event) => ({
      type: "event" as const,
      slug: event.slug,
      title: event.title,
      excerpt: event.description,
      date: event.startAt,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const [featuredFeedItem, ...restFeedItems] = feedItems;

  const heroImages = heroSlides.map((slide) => slide.imageUrl);

  return (
    <>
      <section className="relative overflow-hidden text-primary-foreground">
        {heroImages.length > 0 ? (
          <>
            <HeroSlider images={heroImages} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, var(--primary) 0%, var(--primary) 30%, color-mix(in oklch, var(--primary) 55%, transparent) 55%, color-mix(in oklch, var(--primary) 10%, transparent) 80%)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        )}
        <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
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
                Explore Programmes
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b bg-secondary/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-3 lg:grid-cols-5">
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
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary">
            {settings?.aboutTeaserImageUrl && (
              <Image src={settings.aboutTeaserImageUrl} alt="" fill unoptimized className="object-cover" />
            )}
          </Reveal>
          <Reveal
            delayMs={100}
            className="flex flex-col gap-4 rounded-2xl bg-primary p-10 text-primary-foreground"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">
              About Us
            </span>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Why CIMS Campus?</h2>
            <p className="text-primary-foreground/80">
              {settings?.aboutSummary ??
                "CIMS Campus has been empowering students with world-recognized qualifications, offering degree programmes and vocational training designed for real careers."}
            </p>
            <Button
              size="lg"
              className="mt-2 w-fit bg-accent text-accent-foreground hover:bg-accent/90"
              nativeButton={false}
              render={<Link href="/about" />}
            >
              Explore
            </Button>
          </Reveal>
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
        <Reveal className="mt-10 flex justify-center">
          <Button variant="outline" nativeButton={false} render={<Link href="/programmes" />}>
            View All Programmes
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
            <Reveal className="mt-28">
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

      {partners.length > 0 && (
        <section className="mx-auto w-full max-w-[1520px] px-6 py-20">
          <Reveal className="flex flex-col gap-3 text-center">
            <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">
              Our Network
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Partner Universities &amp; Institutions
            </h2>
          </Reveal>
          <Reveal className="mt-12">
            <PartnerUniversityCarousel
              partners={partners.map((partner) => ({
                name: partner.name,
                logoUrl: partner.logoUrl,
                websiteUrl: partner.websiteUrl,
              }))}
            />
          </Reveal>
        </section>
      )}

      {featuredFeedItem && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <Reveal className="flex flex-col gap-3 text-center">
            <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">News</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Latest Updates</h2>
          </Reveal>
          <div className="mt-10 grid lg:grid-cols-2">
            <Reveal className="h-full">
              <NewsEventsPanel featured={featuredFeedItem} list={restFeedItems.slice(0, 5)} />
            </Reveal>
            <Reveal
              delayMs={100}
              className="h-full rounded-lg border border-accent bg-background p-8 shadow-lg sm:p-10 lg:rounded-l-none"
            >
              <EventsCalendar
                events={events.map((event) => ({
                  slug: event.slug,
                  title: event.title,
                  startAt: event.startAt,
                  location: event.location,
                }))}
              />
            </Reveal>
          </div>
        </section>
      )}

      {settings && (
        <ContactSection
          contactEmail={settings.contactEmail}
          contactAddress={settings.contactAddress}
          contactPhone={settings.contactPhone}
        />
      )}

      <CtaBanner />
    </>
  );
}
