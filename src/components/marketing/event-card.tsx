import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface EventCardData {
  slug: string;
  title: string;
  location: string | null;
  startAt: Date;
  coverImageUrl: string | null;
}

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Card className="group h-full gap-0 py-0 transition-shadow hover:shadow-lg">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          {event.coverImageUrl ? (
            <Image src={event.coverImageUrl} alt="" fill unoptimized className="object-cover" />
          ) : (
            <CalendarDays className="size-10" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <span className="text-sm font-medium text-primary">
            {event.startAt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <h3 className="font-heading text-lg font-semibold text-foreground">{event.title}</h3>
          {event.location && (
            <span className="mt-auto flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {event.location}
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}
