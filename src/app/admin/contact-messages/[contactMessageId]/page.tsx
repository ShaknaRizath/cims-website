import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteContactMessage } from "@/lib/actions/admin/contact-message.actions";

export default async function ContactMessageDetailPage({
  params,
}: {
  params: Promise<{ contactMessageId: string }>;
}) {
  const { contactMessageId } = await params;

  const message = await prisma.contactMessage.findUnique({ where: { id: contactMessageId } });
  if (!message) notFound();

  if (!message.isRead) {
    await prisma.contactMessage.update({ where: { id: contactMessageId }, data: { isRead: true } });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">{message.subject}</h1>
        <DeleteConfirmButton
          action={deleteContactMessage.bind(null, message.id)}
          title="Delete this message?"
          description="This permanently deletes the contact message. This cannot be undone."
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{message.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href={`mailto:${message.email}`} className="flex items-center gap-1.5 hover:text-primary">
              <Mail className="size-4" /> {message.email}
            </a>
            <a href={`tel:${message.mobile}`} className="flex items-center gap-1.5 hover:text-primary">
              <Phone className="size-4" /> {message.mobile}
            </a>
          </div>
          <p className="text-sm text-muted-foreground">Received {message.createdAt.toLocaleString()}</p>
          <p className="whitespace-pre-wrap text-foreground">{message.message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
