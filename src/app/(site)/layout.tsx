import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

const FALLBACK_SETTINGS = {
  contactPhone: "+94 77 359 0505",
  contactEmail: "info@cims.lk",
  lmsUrl: "https://lms.cims.lk",
  certificateVerifyUrl: "https://lms.cims.lk/verify",
  onlinePaymentUrl: "https://lms.cims.lk/login?callbackUrl=/student/payments",
  facebookUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  youtubeUrl: null,
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, campuses] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.campusLocation.findMany({ orderBy: { orderIndex: "asc" }, select: { id: true, name: true, city: true } }),
  ]);

  const headerFooterSettings = settings ?? FALLBACK_SETTINGS;

  return (
    <>
      <Header settings={headerFooterSettings} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer settings={headerFooterSettings} campuses={campuses} />
    </>
  );
}
