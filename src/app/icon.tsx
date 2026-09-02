import { readFile } from "node:fs/promises";
import path from "node:path";
import { isOldSiteRequest } from "@/lib/site/branding";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Dynamic (not a static icon.png) so it can serve a different image per domain —
// cims.edu.lk keeps its old tab icon, cims.lk gets the new one. favicon.ico itself
// can't be generated this way (Next.js only allows a static file for that convention),
// so it stays shared; modern browsers prefer this icon over favicon.ico anyway.
export default async function Icon() {
  const isOld = await isOldSiteRequest();
  const file = isOld ? "old-icon.png" : "new-icon.png";
  const buffer = await readFile(path.join(process.cwd(), "public/site-icons", file));
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "image/png" } });
}
