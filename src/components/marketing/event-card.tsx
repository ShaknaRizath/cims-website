import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface EventCardData {
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: Date;
  coverImageUrl: string | null;
  cardImageUrl: string | null;
}

export function EventCard({ event, isPast = false }: { event: EventCardData; isPast?: boolean }) {
  // Prefer the deliberately-cropped card thumbnail; fall back to the full poster
  // (browser-cropped via object-cover) for events created before that field existed.
  const thumbnailUrl = event.cardImageUrl ?? event.coverImageUrl;

  return (
    <Card className="group h-full gap-0 py-0 transition-shadow hover:shadow-lg">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-secondary/60 text-primary">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt="" fill unoptimized className="object-cover" />
          ) : (
            <CalendarDays className="size-10" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {isPast && <Badge variant="outline">Past</Badge>}
            <span className="text-xs text-muted-foreground">
              {event.startAt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{event.title}</h3>
          {event.description && <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{event.description}</p>}
          {event.location && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {event.location}
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}
