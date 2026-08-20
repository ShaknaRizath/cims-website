import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Contact | CIMS Campus",
  description: "Get in touch with CIMS Campus across our Colombo, Kandy, and Kurunegala campuses.",
};

export default async function ContactPage() {
  const [settings, campuses] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    prisma.campusLocation.findMany({ orderBy: { orderIndex: "asc" } }),
  ]);

  return (
    <>
      <PageHero title="Get in Touch" description="Reach out to any of our campuses for admissions or general enquiries." />
      <div className="mx-auto max-w-7xl px-6 py-16">
      {settings && (
        <Reveal className="mx-auto flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-1.5 hover:text-primary">
            <Phone className="size-4" /> {settings.contactPhone}
          </a>
          <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-1.5 hover:text-primary">
            <Mail className="size-4" /> {settings.contactEmail}
          </a>
        </Reveal>
      )}

      {campuses.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">Campus details coming soon.</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campuses.map((campus, index) => (
            <Reveal key={campus.id} delayMs={index * 100}>
              <Card className="h-full gap-4 p-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">{campus.name}</h2>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>
                    {campus.addressLine1}
                    {campus.addressLine2 ? `, ${campus.addressLine2}` : ""}, {campus.city}
                  </span>
                </div>
                {campus.phone && (
                  <a href={`tel:${campus.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Phone className="size-4" /> {campus.phone}
                  </a>
                )}
                {campus.email && (
                  <a href={`mailto:${campus.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Mail className="size-4" /> {campus.email}
                  </a>
                )}
                {campus.mapEmbedUrl && (
                  <CardContent className="p-0">
                    <iframe
                      src={campus.mapEmbedUrl}
                      className="h-48 w-full rounded-lg border-0"
                      loading="lazy"
                      title={`Map for ${campus.name}`}
                    />
                  </CardContent>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
