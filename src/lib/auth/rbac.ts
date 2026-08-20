import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * Base check for the /admin CMS: any authenticated, active admin regardless
 * of role. Re-reads `isActive` from the DB (the JWT can't be revoked, so a
 * deactivated admin's session cookie alone isn't enough to deny access) and
 * redirects otherwise.
 */
export async function requireAnyAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  // No matching admin means a stale session (e.g. the account was deleted, or this
  // JWT predates a dev database reset). Redirecting straight to /login would loop
  // forever — proxy.ts's optimistic JWT-only check still sees this cookie's role
  // claim and bounces any /login visit straight back to /admin, which fails this
  // same check again. Route through clear-stale-session instead, which clears the
  // cookie first.
  if (!admin) {
    redirect("/api/auth/clear-stale-session");
  }

  if (!admin.isActive) {
    redirect("/unauthorized");
  }

  return admin;
}

/**
 * Full-CMS check: everything requireAnyAdmin() checks, plus role === "ADMIN".
 * Used by every admin action outside of Applications — ADMISSIONS_OFFICER
 * accounts are confined to viewing/updating applications (see proxy.ts and
 * admin-nav.ts) and must not be able to reach these regardless of what the
 * client sends.
 */
export async function requireAdmin() {
  const admin = await requireAnyAdmin();
  if (admin.role !== "ADMIN") {
    redirect("/unauthorized");
  }
  return admin;
}
