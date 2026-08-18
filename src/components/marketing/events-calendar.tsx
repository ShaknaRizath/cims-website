"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventCalendarData {
  slug: string;
  title: string;
  startAt: Date;
  location: string | null;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Monday-first 6x7 grid, including the leading/trailing days from adjacent months.
function buildMonthGrid(monthDate: Date) {
  const first = startOfMonth(monthDate);
  const leadingCount = (first.getDay() + 6) % 7; // getDay(): 0=Sun..6=Sat -> 0=Mon..6=Sun
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - leadingCount);

  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);
    return day;
  });
}

export function EventsCalendar({ events }: { events: EventCalendarData[] }) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => startOfMonth(today));
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

  const days = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const selectedEvents = selectedDate ? (eventsByDay.get(dayKey(selectedDate)) ?? []) : [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          className="text-muted-foreground transition hover:text-primary"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="font-heading text-2xl font-light text-foreground sm:text-3xl">
          {viewDate.toLocaleDateString(undefined, { month: "long" })}
          <span className="mx-2 text-muted-foreground">|</span>
          {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          className="text-muted-foreground transition hover:text-primary"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 border-b text-xs font-medium text-muted-foreground sm:text-sm">
        {WEEKDAYS.map((day) => (
          <span key={day} className="pb-3">
            <span className="sm:hidden">{day.slice(0, 3)}</span>
            <span className="hidden sm:inline">{day}</span>
          </span>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 grid-rows-6">
        {days.map((day) => {
          const inMonth = day.getMonth() === viewDate.getMonth();
          const key = dayKey(day);
          const hasEvent = eventsByDay.has(key);
          const isToday = key === dayKey(today);
          const isSelected = selectedDate && key === dayKey(selectedDate);

          return (
            <button
              key={key}
              type="button"
              disabled={!hasEvent}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-start gap-1 border-b p-2 text-left text-sm sm:p-3",
                !inMonth && "text-muted-foreground/40",
                inMonth && !hasEvent && "text-foreground",
                hasEvent && "cursor-pointer font-semibold text-primary",
                isSelected && "bg-primary/5",
              )}
            >
              <span className={cn(isToday && "underline decoration-2 underline-offset-4")}>{day.getDate()}</span>
              {hasEvent && <span className="size-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      {selectedEvents.length > 0 && (
        <div className="mt-6 border-t pt-4">
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
    </div>
  );
}
