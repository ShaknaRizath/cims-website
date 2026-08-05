// No transactional-email provider is wired up for this project yet (a single
// ADMIN account doesn't warrant the LMS's full notification-adapter stack) —
// this just logs the reset link to the server console for now. Swap in a real
// provider (e.g. Resend) here once the CMS has more than one admin user.
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  console.log(`[password-reset] ${email} -> ${resetUrl}`);
}
