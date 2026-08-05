import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { updateEvent, deleteEvent } from "@/lib/actions/admin/event.actions";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{event.title}</h1>
        <DeleteConfirmButton
          action={deleteEvent.bind(null, event.id)}
          title={`Delete "${event.title}"?`}
          description="This permanently deletes the event. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            action={updateEvent.bind(null, event.id)}
            defaultValues={event}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
