import { signOut } from "@/auth";

// Reached only via requireAdmin, when a signed session cookie's admin no longer
// exists in the database (deleted account, or a dev database reset). See the
// matching comment in src/lib/auth/rbac.ts for why this can't just redirect.
export async function GET() {
  await signOut({ redirectTo: "/login" });
}
