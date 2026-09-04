import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

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
    <>
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
          // Not Next's <Image fill> here — that needs a fixed-aspect container, which would
          // crop tall posters/flyers the same way object-cover did. Image dimensions aren't
          // stored, so a plain <img> at its natural size (capped by max-height/width) is what
          // lets both wide photos and tall posters display in full, uncropped. The wrapper
          // has no forced width/background, so it never shows more than the image itself.
          <Reveal delayMs={100} className="mt-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.coverImageUrl} alt="" className="max-h-[720px] max-w-full rounded-xl object-contain" />
          </Reveal>
        )}

        {event.description && (
          <Reveal delayMs={200} className="mt-8 whitespace-pre-line text-muted-foreground">
            {event.description}
          </Reveal>
        )}
      </article>
      <CtaBanner />
    </>
  );
}
