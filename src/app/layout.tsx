import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { isOldSiteRequest, OLD_SITE_NAME, NEW_SITE_NAME } from "@/lib/site/branding";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const isOld = await isOldSiteRequest();
  return {
    metadataBase: new URL("https://www.cims.edu.lk"),
    title: `CIMS Campus | ${isOld ? OLD_SITE_NAME : NEW_SITE_NAME}`,
    description:
      "CIMS Campus offers degree programmes and vocational training in Engineering & Technology, Business & Economics, and Law & Education.",
    // The same site is also served live on cims.lk — this tells search engines
    // cims.edu.lk is the canonical version, avoiding a duplicate-content penalty.
    alternates: {
      canonical: "/",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
