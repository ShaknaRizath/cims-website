import type { Metadata } from "next";
import { Reveal } from "@/components/marketing/reveal";
import { CtaBanner } from "@/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Career Guidance | CIMS Campus",
  description: "Career guidance and placement support at CIMS Campus.",
};

export default function CareerGuidancePage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Reveal className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">Success Stories</span>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Career Guidance</h1>
          <p className="text-muted-foreground">
            Our Career Guidance team works with students throughout their studies — from choosing the right
            programme to CV workshops, mock interviews, and connecting graduates with our network of industry
            partners.
          </p>
          <p className="text-muted-foreground">
            Whether you&apos;re exploring which programme fits your goals or preparing to enter the job market, our team
            is here to help every step of the way.
          </p>
        </Reveal>
      </div>
      <CtaBanner />
    </>
  );
}
