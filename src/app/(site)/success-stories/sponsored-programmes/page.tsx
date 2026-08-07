import type { Metadata } from "next";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Sponsored Programmes | CIMS Campus",
  description: "Scholarship and sponsorship opportunities at CIMS Campus.",
};

export default function SponsoredProgrammesPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">Success Stories</span>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Sponsored Programmes</h1>
          <p className="text-muted-foreground">
            CIMS Campus partners with corporate sponsors and alumni donors to fund scholarships for high-achieving
            and financially disadvantaged students across our degree and diploma programmes.
          </p>
          <p className="text-muted-foreground">
            Interested in sponsoring a student, or applying for a sponsored place? Contact our admissions team to
            learn more about eligibility and current opportunities.
          </p>
        </Reveal>
      </div>
      <CtaBanner
        headline="Interested in sponsoring or applying?"
        subtext="Reach out to our admissions team to learn more about eligibility and current sponsorship opportunities."
      />
    </>
  );
}
