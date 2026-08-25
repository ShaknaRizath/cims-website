import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!resend) {
    console.log(`[password-reset] ${email} -> ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "CIMS Campus <onboarding@resend.dev>",
    to: email,
    subject: "Reset your CIMS Campus admin password",
    html: `
      <p>A password reset was requested for your CIMS Campus admin account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  });
}
