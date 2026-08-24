import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { EventCard } from "@/components/marketing/event-card";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Events | CIMS Campus",
  description: "Upcoming and past events at CIMS Campus.",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { startAt: "asc" },
  });

  const now = new Date();
  const upcomingEvents = events.filter((event) => event.startAt >= now);
  const pastEvents = events
    .filter((event) => event.startAt < now)
    .sort((a, b) => b.startAt.getTime() - a.startAt.getTime());

  return (
    <>
      <PageHero title="Events" description="Open days, workshops, and everything else happening at CIMS Campus." />
      <div className="mx-auto max-w-7xl px-6 py-16">
        {events.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">No events published yet.</p>
        ) : (
          <>
            {upcomingEvents.length > 0 && (
              <section>
                <h2 className="font-heading text-xl font-semibold text-foreground">Upcoming Events</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event, index) => (
                    <Reveal key={event.id} delayMs={(index % 3) * 100}>
                      <EventCard event={event} />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {pastEvents.length > 0 && (
              <section className={upcomingEvents.length > 0 ? "mt-16" : undefined}>
                <h2 className="font-heading text-xl font-semibold text-foreground">Past Events</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event, index) => (
                    <Reveal key={event.id} delayMs={(index % 3) * 100}>
                      <EventCard event={event} isPast />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <CtaBanner />
    </>
  );
}
