import { readFile } from "node:fs/promises";
import path from "node:path";
import { isOldSiteRequest } from "@/lib/site/branding";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// See icon.tsx — same per-domain split, sized for Apple's touch-icon convention.
export default async function Icon() {
  const isOld = await isOldSiteRequest();
  const file = isOld ? "old-apple-icon.png" : "new-apple-icon.png";
  const buffer = await readFile(path.join(process.cwd(), "public/site-icons", file));
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "image/png" } });
}
