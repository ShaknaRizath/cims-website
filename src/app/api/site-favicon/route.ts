import { readFile } from "node:fs/promises";
import path from "node:path";
import { isOldSiteRequest } from "@/lib/site/branding";

// Next.js's special `favicon` file convention only accepts a static .ico file (it
// can't be generated dynamically like `icon`/`apple-icon` can), and a route handler
// literally named `app/favicon.ico/route.ts` is silently ignored — Next still
// reserves that name. So next.config.ts rewrites the real /favicon.ico request to
// this ordinary route instead, which serves the same per-domain assets /icon uses.
export async function GET() {
  const isOld = await isOldSiteRequest();
  const file = isOld ? "old-icon.png" : "new-icon.png";
  const buffer = await readFile(path.join(process.cwd(), "public/site-icons", file));
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "image/png" } });
}
