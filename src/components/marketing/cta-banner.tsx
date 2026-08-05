import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";

interface CtaBannerProps {
  headline?: string;
  subtext?: string;
}

export function CtaBanner({
  headline = "Ready to start your journey?",
  subtext = "Applications for the next intake are now open — take the first step toward your degree today.",
}: CtaBannerProps) {
  return (
    <section className="bg-primary text-primary-foreground">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">{headline}</h2>
          <p className="max-w-xl text-primary-foreground/80">{subtext}</p>
        </div>
        <Button
          size="lg"
          className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
          nativeButton={false}
          render={<Link href="/apply" />}
        >
          Apply Now
        </Button>
      </Reveal>
    </section>
  );
}
