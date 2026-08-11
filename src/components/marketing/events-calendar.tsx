"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface EventCalendarData {
  slug: string;
  title: string;
  startAt: Date;
  location: string | null;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function EventsCalendar({ events }: { events: EventCalendarData[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventCalendarData[]>();
    for (const event of events) {
      const key = dayKey(event.startAt);
      const existing = map.get(key);
      if (existing) {
        existing.push(event);
      } else {
        map.set(key, [event]);
      }
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? (eventsByDay.get(dayKey(selectedDate)) ?? []) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{ hasEvent: (date) => eventsByDay.has(dayKey(date)) }}
          modifiersClassNames={{ hasEvent: "font-semibold text-primary bg-primary/10" }}
        />
        {selectedEvents.length > 0 && (
          <div className="w-full border-t pt-4">
            <p className="mb-2 text-sm font-medium text-foreground">
              {selectedDate?.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <ul className="flex flex-col gap-3">
              {selectedEvents.map((event) => (
                <li key={event.slug}>
                  <Link href={`/events/${event.slug}`} className="flex flex-col text-sm hover:underline">
                    <span className="font-medium text-foreground">{event.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {event.startAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      {event.location && (
                        <>
                          <MapPin className="ml-1 size-3" /> {event.location}
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
