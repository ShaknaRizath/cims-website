import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { EventCard } from "@/components/marketing/event-card";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Events | CIMS Campus",
  description: "Upcoming and past events at CIMS Campus.",
};

export default async function EventsPage() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { isPublished: true, startAt: { gte: now } },
      orderBy: { startAt: "asc" },
    }),
    prisma.event.findMany({
      where: { isPublished: true, startAt: { lt: now } },
      orderBy: { startAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Reveal className="flex flex-col gap-3 text-center">
        <span className="mx-auto text-sm font-semibold uppercase tracking-wide text-primary">Events</span>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Campus Events</h1>
      </Reveal>

      <section className="mt-12">
        <Reveal>
          <h2 className="font-heading text-xl font-semibold text-foreground">Upcoming</h2>
        </Reveal>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No upcoming events scheduled right now.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, index) => (
              <Reveal key={event.id} delayMs={(index % 3) * 100}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="font-heading text-xl font-semibold text-foreground">Past Events</h2>
          </Reveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event, index) => (
              <Reveal key={event.id} delayMs={(index % 3) * 100}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
