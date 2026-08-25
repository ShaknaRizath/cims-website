import { Resend } from "resend";
import type { ContactMessage } from "@/generated/prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The message is always saved via ContactMessage and visible in
// /admin/contact-messages regardless of whether this email goes out.
export async function sendContactNotification(contactMessage: ContactMessage) {
  if (!resend) {
    console.log(`[contact] New message from ${contactMessage.name} <${contactMessage.email}>: ${contactMessage.subject}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "CIMS Campus <onboarding@resend.dev>",
    to: process.env.CONTACT_NOTIFICATION_EMAIL ?? "info@cims.lk",
    replyTo: contactMessage.email,
    subject: `New contact message: ${escapeHtml(contactMessage.subject)}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(contactMessage.name)} &lt;${escapeHtml(contactMessage.email)}&gt;</p>
      <p><strong>Subject:</strong> ${escapeHtml(contactMessage.subject)}</p>
      <p>${escapeHtml(contactMessage.message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
