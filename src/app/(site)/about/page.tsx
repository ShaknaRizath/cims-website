import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, GraduationCap, Users, Compass, Eye, Target, Lightbulb, Handshake, BookOpen, Trophy } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "About Us | CIMS Campus",
  description: "Learn about CIMS Campus, our mission, and our Chairman's message.",
};

const whyCims = [
  {
    icon: BadgeCheck,
    title: "Recognized Qualifications",
    description: "Degree and diploma programmes recognized by industry and higher education partners.",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Lecturers who know their students, with hands-on support throughout your studies.",
  },
  {
    icon: GraduationCap,
    title: "Career-Focused",
    description: "Curricula built with industry input and clear pathways into employment.",
  },
];

const whatWeValue = [
  {
    icon: Lightbulb,
    title: "Innovation & Creativity",
    description: "We encourage fresh thinking and creative problem-solving in everything we teach.",
  },
  {
    icon: Handshake,
    title: "Openness & Accountability",
    description: "We hold ourselves to clear standards and are transparent with our students and partners.",
  },
  {
    icon: BookOpen,
    title: "Knowledge",
    description: "We are committed to the pursuit and sharing of knowledge that shapes the future.",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "We aim for excellence in teaching, research, and student outcomes, in everything we do.",
  },
];

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <PageHero
        title="Why CIMS Campus"
        description={settings?.aboutSummary ?? undefined}
        imageUrl={settings?.aboutHeroImageUrl}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {whyCims.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 100} className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-6" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: Compass, title: "Our Role", text: settings?.ourRole },
            { icon: Eye, title: "Our Vision", text: settings?.ourVision },
            { icon: Target, title: "Our Mission", text: settings?.ourMission },
          ].map((item, index) => (
            <Reveal key={item.title} delayMs={index * 100} className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-6" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.text ?? "This section hasn't been filled in yet — edit it from Admin → Settings."}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="flex flex-col gap-3 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Our Values</span>
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">What We Value</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whatWeValue.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 100} className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {settings?.chairmanMessageHtml && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-[auto_1fr] sm:items-start">
            <Reveal className="flex justify-center sm:justify-start">
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                {settings.chairmanPhotoUrl ? (
                  <Image src={settings.chairmanPhotoUrl} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <Users className="size-10" />
                )}
              </div>
            </Reveal>
            <Reveal delayMs={100} className="flex flex-col gap-3">
              <h2 className="font-heading text-2xl font-bold text-foreground">Message from the Chairman</h2>
              <p className="whitespace-pre-line text-muted-foreground">{settings.chairmanMessageHtml}</p>
            </Reveal>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
