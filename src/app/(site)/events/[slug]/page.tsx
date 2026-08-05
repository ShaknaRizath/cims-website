import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Reveal } from "@/components/marketing/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return {};
  return {
    title: `${event.title} | CIMS Campus`,
    description: event.description ?? undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.isPublished) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Reveal className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {event.startAt.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
            {event.endAt && ` – ${event.endAt.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}`}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {event.location}
            </span>
          )}
        </div>
      </Reveal>

      {event.coverImageUrl && (
        <Reveal delayMs={100} className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image src={event.coverImageUrl} alt="" fill unoptimized className="object-cover" />
        </Reveal>
      )}

      {event.description && (
        <Reveal delayMs={200} className="mt-8 whitespace-pre-line text-muted-foreground">
          {event.description}
        </Reveal>
      )}
    </article>
  );
}
