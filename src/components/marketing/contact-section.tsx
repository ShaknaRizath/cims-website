import { Mail, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";
import { ContactForm } from "@/components/marketing/contact-form";

export function ContactSection({
  contactEmail,
  contactAddress,
  contactPhone,
}: {
  contactEmail: string;
  contactAddress: string;
  contactPhone: string;
}) {
  const details = [
    { icon: Mail, label: contactEmail, href: `mailto:${contactEmail}` },
    { icon: MapPin, label: contactAddress, href: undefined },
    { icon: Phone, label: contactPhone, href: `tel:${contactPhone}` },
  ];

  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Contact Us</span>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Get in Touch</h2>
            <p className="max-w-md text-muted-foreground">
              Have a question about our programmes or admissions? Send us a message and our team will get back to
              you shortly.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {details.map((detail) => {
              const content = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <detail.icon className="size-5" />
                  </span>
                  <span className="text-sm text-foreground">{detail.label}</span>
                </>
              );
              return detail.href ? (
                <a key={detail.label} href={detail.href} className="flex items-center gap-3 hover:text-primary">
                  {content}
                </a>
              ) : (
                <div key={detail.label} className="flex items-center gap-3">
                  {content}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <Card className="p-6 shadow-lg sm:p-8">
            <ContactForm />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
