import type { Application } from "@/generated/prisma/client";

// Same gap as send-contact-notification.ts — no transactional-email provider
// wired up yet, so this just logs. The application is still saved and
// visible in /admin/applications regardless.
export async function sendApplicationNotification(application: Application) {
  console.log(`[apply] New application from ${application.fullName} <${application.email}> for programme ${application.programmeId}`);
}
