import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { createEvent } from "@/lib/actions/admin/event.actions";

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">New Event</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm action={createEvent} submitLabel="Create event" />
        </CardContent>
      </Card>
    </div>
  );
}
