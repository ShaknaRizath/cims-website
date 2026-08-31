import { Resend } from "resend";
import type { Application } from "@/generated/prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The application is always saved and visible in /admin/applications
// regardless of whether this email goes out.
export async function sendApplicationNotification(application: Application) {
  if (!resend) {
    console.log(`[apply] New application from ${application.fullName} <${application.email}> for programme ${application.programmeId}`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "CIMS Campus <onboarding@resend.dev>",
      to: process.env.APPLICATION_NOTIFICATION_EMAIL ?? "info@cims.lk",
      replyTo: application.email,
      subject: `New application: ${escapeHtml(application.fullName)}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(application.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(application.mobileNumber)}</p>
        <p>View the full application in the admin dashboard under Applications.</p>
      `,
    });
    if (error) console.error("[apply] Resend error:", error);
  } catch (err) {
    console.error("[apply] Failed to send notification email:", err);
  }
}
