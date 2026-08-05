import Link from "next/link";
import { GraduationCap, Newspaper, CalendarDays, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";

export default async function AdminDashboardPage() {
  const [programmeCount, newsCount, eventCount, testimonialCount] = await Promise.all([
    prisma.programme.count(),
    prisma.newsPost.count(),
    prisma.event.count(),
    prisma.testimonial.count(),
  ]);

  const stats = [
    { label: "Programmes", value: programmeCount, href: "/admin/programmes", icon: GraduationCap },
    { label: "News & Announcements", value: newsCount, href: "/admin/news", icon: Newspaper },
    { label: "Events", value: eventCount, href: "/admin/events", icon: CalendarDays },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials", icon: Quote },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your CIMS Campus website content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="font-heading text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
