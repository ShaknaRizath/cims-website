import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";

const OLD_SITE_HOSTNAMES = new Set(["cims.edu.lk", "www.cims.edu.lk"]);

export async function isOldSiteRequest(): Promise<boolean> {
  const host = (await headers()).get("host") ?? "";
  return OLD_SITE_HOSTNAMES.has(host.split(":")[0].toLowerCase());
}

export const OLD_SITE_NAME = "Ceylon Institute of Management Sciences";
export const NEW_SITE_NAME = "College of Information Management and Sciences";

// Frozen snapshot (taken 2026-09-02, the day cims.lk and cims.edu.lk diverged) of what
// was live in the SiteSettings row at that moment. cims.edu.lk must never change again,
// so these are hardcoded here rather than read from SiteSettings — which, from this
// point on, only ever reflects cims.lk and is freely admin-editable for it.
const OLD_SITE_BRAND = {
  siteName: OLD_SITE_NAME,
  logoUrl: "https://res.cloudinary.com/arnucbe3/image/upload/v1787639082/cims-website/settings/cims-logo.png",
  aboutSummary:
    "College of Information Management and Sciences (CIMS), registered with the Registrar of Companies (RoC) as a Private Limited Company in September 2006 and again re-registered in July 2007 with the Registrar of Companies (RoC) under the Companies Act, incorporated in Parliament Act of 2007 as a Private Limited Company with the registration number PV 61481. CIMS offers UGC-recognized Degree programs and TVEC-approved programs, providing recognized Higher Education and professional qualifications to its students.\n\nOn the 16th day of May 2022, College of Information Management and Sciences was rebranded as Ceylon Institute of Management Sciences and incorporated under the Registrar of Companies (RoC) with Registration No. PV 0025768 to seek the approval from the Ministry of Education as a non-state Degree awarding institution, with additional Directors and investment from external entities for a large scale project.",
  ourRole:
    "To provide quality Higher Education from Diploma to Doctoral level, empowering learners with academic knowledge, professional expertise, and practical skills for career advancement and lifelong success.",
  ourVision:
    "Be the center of excellence to provide education, consultancy and related services in Science and Technology, Business and Economics ,Education and Humanities Sciences.",
  ourMission:
    "Generating skilled and competent human capital through pro-active, practical education to eliminate un employment and meet global challenges that will develop the socio-economical condition of the region.",
  chairmanMessageHtml:
    "Welcome to CIMS Campus. For nearly two decades, we have been committed to providing accessible, High-quality Higher Education that prepares our students for real careers. Our graduates go on to lead in industry, government, and their own ventures and I invite you to become part of that story.",
  chairmanPhotoUrl: null as string | null,
  aboutHeroImageUrl:
    "https://res.cloudinary.com/arnucbe3/image/upload/v1787639053/cims-website/settings/6c4f1d71-1169-4ec2-8a3d-c71044dab04c-19f05f75-0431-4f5d-9772-08d082d1875c.jpg",
  aboutTeaserImageUrl:
    "https://res.cloudinary.com/arnucbe3/image/upload/v1787639072/cims-website/settings/88671c2b-f219-4763-95d4-fcc3d8bde345-why_cims.jpg",
} as const;

// Merges the live, admin-editable SiteSettings row with the frozen cims.edu.lk
// snapshot above when the request is for the old domain — every public page/layout
// that reads SiteSettings should go through this instead of querying prisma directly.
// Returns null (like the raw prisma call) when the singleton row itself is missing and
// the request isn't for the old domain, so callers keep using their own fallback settings.
export async function getBrandedSiteSettings() {
  const [settings, isOld] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    isOldSiteRequest(),
  ]);

  if (!settings) return null;

  if (!isOld) {
    return { ...settings, siteName: NEW_SITE_NAME };
  }

  return {
    ...settings,
    siteName: OLD_SITE_BRAND.siteName,
    logoUrl: OLD_SITE_BRAND.logoUrl,
    aboutSummary: OLD_SITE_BRAND.aboutSummary,
    ourRole: OLD_SITE_BRAND.ourRole,
    ourVision: OLD_SITE_BRAND.ourVision,
    ourMission: OLD_SITE_BRAND.ourMission,
    chairmanMessageHtml: OLD_SITE_BRAND.chairmanMessageHtml,
    chairmanPhotoUrl: OLD_SITE_BRAND.chairmanPhotoUrl,
    aboutHeroImageUrl: OLD_SITE_BRAND.aboutHeroImageUrl,
    aboutTeaserImageUrl: OLD_SITE_BRAND.aboutTeaserImageUrl,
  };
}
