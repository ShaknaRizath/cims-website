import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

// Built from the Prisma-free auth.config so this bundle (which runs on every
// request) never pulls in the generated Prisma client — see auth.config.ts.
const { auth } = NextAuth(authConfig);

// Optimistic, JWT-only check — no DB access here (proxy runs on every request,
// including prefetches). Authoritative re-check (isActive) happens in
// /admin/layout.tsx via requireRole().
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/admin")) {
    if (!role) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Admissions Officers are confined to the Applications area — everything
    // else in the CMS (programmes, news, settings, etc.) is ADMIN-only.
    if (role === "ADMISSIONS_OFFICER" && !pathname.startsWith("/admin/applications")) {
      return NextResponse.redirect(new URL("/admin/applications", req.nextUrl));
    }
    if (role !== "ADMIN" && role !== "ADMISSIONS_OFFICER") {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }
  }

  if (pathname === "/login" && role) {
    const destination = role === "ADMISSIONS_OFFICER" ? "/admin/applications" : "/admin";
    return NextResponse.redirect(new URL(destination, req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
