import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="Events"
        description="Campus events shown on the public Events page."
        newLabel="New Event"
        newHref="/admin/events/new"
      />
      {events.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarDays />
            </EmptyMedia>
            <EmptyTitle>No events yet</EmptyTitle>
            <EmptyDescription>Events you add will appear here and on the public Events page.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/events/${event.id}`} className="hover:underline">
                    {event.title}
                  </Link>
                </TableCell>
                <TableCell>{event.location ?? "—"}</TableCell>
                <TableCell>{event.startAt.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={event.isPublished ? "secondary" : "outline"}>
                    {event.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
