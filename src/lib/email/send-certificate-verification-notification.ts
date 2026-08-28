import { Resend } from "resend";
import type { CertificateVerificationRequest } from "@/generated/prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The request is always saved and visible in /admin/certificate-verification-requests
// regardless of whether this email goes out.
export async function sendCertificateVerificationNotification(request: CertificateVerificationRequest) {
  if (!resend) {
    console.log(
      `[certificate-verification] ${request.verifierName} <${request.verifierEmail}> requested verification for ${request.studentName} (${request.certificateNumber})`,
    );
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "CIMS Campus <onboarding@resend.dev>",
    to: process.env.CERTIFICATE_VERIFICATION_NOTIFICATION_EMAIL ?? "verify@cims.lk",
    replyTo: request.verifierEmail,
    subject: `New certificate verification request: ${escapeHtml(request.studentName)}`,
    html: `
      <p><strong>Verifier:</strong> ${escapeHtml(request.verifierName)} (${escapeHtml(request.verifierInstitution)}, ${escapeHtml(request.verifierDepartment)})</p>
      <p><strong>Verifier Mobile:</strong> ${escapeHtml(request.verifierMobile)}</p>
      <p><strong>Verifier Email:</strong> ${escapeHtml(request.verifierEmail)}</p>
      <p><strong>Purpose:</strong> ${escapeHtml(request.purpose)}</p>
      <hr>
      <p><strong>Student Name:</strong> ${escapeHtml(request.studentName)}</p>
      <p><strong>Certificate Number:</strong> ${escapeHtml(request.certificateNumber)}</p>
    `,
  });
}
