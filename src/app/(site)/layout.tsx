import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppWidget } from "@/components/marketing/whatsapp-widget";

const FALLBACK_SETTINGS = {
  contactPhone: "+94 77 359 0505",
  contactEmail: "info@cims.lk",
  lmsUrl: "https://lms.cims.lk",
  certificateVerifyUrl: "https://lms.cims.lk/verify",
  onlinePaymentUrl: "https://lms.cims.lk/login?callbackUrl=/student/payments",
  whatsappNumber: null,
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
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Header settings={headerFooterSettings} />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer settings={headerFooterSettings} campuses={campuses} />
      <WhatsAppWidget whatsappNumber={headerFooterSettings.whatsappNumber} />
    </>
  );
}
