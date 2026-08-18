import Link from "next/link";

export interface FeedItem {
  type: "news" | "event";
  slug: string;
  title: string;
  excerpt: string | null;
  date: Date;
}

function hrefFor(item: FeedItem) {
  return item.type === "news" ? `/news/${item.slug}` : `/events/${item.slug}`;
}

function DateBox({ date }: { date: Date }) {
  return (
    <span className="inline-flex w-14 shrink-0 flex-col items-center justify-center rounded bg-primary px-2 py-1.5 text-primary-foreground">
      <span className="text-lg leading-none font-bold">{date.getDate()}</span>
      <span className="text-[10px] leading-none uppercase">
        {date.toLocaleDateString(undefined, { month: "short" })}
      </span>
    </span>
  );
}

export function NewsEventsPanel({ featured, list }: { featured: FeedItem | null; list: FeedItem[] }) {
  if (!featured) return null;

  return (
    <div className="relative grid h-full gap-10 rounded-lg bg-accent p-8 sm:grid-cols-2 sm:p-10 lg:rounded-r-none">
      <div className="absolute inset-y-8 left-1/2 hidden w-px -translate-x-1/2 bg-white/60 sm:block" />
      <div>
        <h3 className="text-xs font-semibold tracking-wide text-accent-foreground/70 uppercase">
          News &amp; Events
        </h3>
        <div className="mt-5 flex flex-col gap-3">
          <DateBox date={featured.date} />
          <h4 className="font-heading text-lg font-semibold text-accent-foreground">{featured.title}</h4>
          {featured.excerpt && (
            <p className="line-clamp-3 text-sm text-accent-foreground/80">{featured.excerpt}</p>
          )}
          <Link
            href={hrefFor(featured)}
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wide text-accent-foreground/70 uppercase">
          Latest News &amp; Events List
        </h3>
        {list.length > 0 && (
          <ul className="mt-5 flex flex-col">
            {list.map((item) => (
              <li key={`${item.type}-${item.slug}`} className="border-b border-accent-foreground/15 py-3 last:border-0">
                <Link href={hrefFor(item)} className="group flex flex-col gap-1.5">
                  <span className="w-fit rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {item.date.toLocaleDateString(undefined, { month: "long", day: "numeric" })}
                  </span>
                  <span className="text-sm font-medium text-accent-foreground group-hover:underline">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
