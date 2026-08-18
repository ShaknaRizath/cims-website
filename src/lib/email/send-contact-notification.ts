import type { ContactMessage } from "@/generated/prisma";

// No transactional-email provider is wired up for this project yet (see
// src/lib/auth/send-password-reset-email.ts for the same gap) — this just
// logs the submission to the server console. The message is still saved via
// ContactMessage and visible in /admin/contact-messages regardless. Swap in a
// real provider (e.g. Resend) here to also deliver these to info@cims.lk.
export async function sendContactNotification(contactMessage: ContactMessage) {
  console.log(`[contact] New message from ${contactMessage.name} <${contactMessage.email}>: ${contactMessage.subject}`);
}
