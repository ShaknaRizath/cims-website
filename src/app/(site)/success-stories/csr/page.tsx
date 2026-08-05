import type { Metadata } from "next";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "CSR | CIMS Campus",
  description: "CIMS Campus's corporate social responsibility initiatives.",
};

export default function CsrPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal className="flex flex-col gap-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">Success Stories</span>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Corporate Social Responsibility</h1>
        <p className="text-muted-foreground">
          Beyond the classroom, CIMS Campus is committed to giving back to the communities we serve. Our students
          and staff take part in outreach programmes, community education drives, and partnerships with local
          organizations throughout the year.
        </p>
        <p className="text-muted-foreground">
          From free digital-literacy workshops for underserved schools to fundraising drives for local causes, our
          CSR initiatives reflect the same values we teach in our classrooms — responsibility, empathy, and
          leadership.
        </p>
      </Reveal>
    </div>
  );
}
