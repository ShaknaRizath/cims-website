import Image from "next/image";
import { Reveal } from "@/components/marketing/reveal";

export function PageHero({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description?: string;
  imageUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
      {imageUrl && <Image src={imageUrl} alt="" fill unoptimized className="object-cover opacity-25" />}
      <div className="relative mx-auto flex max-w-3xl flex-col gap-3 px-6 py-16">
        <Reveal>
          <h1 className="font-heading text-3xl font-bold sm:text-5xl">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delayMs={100}>
            <p className="max-w-2xl text-lg text-primary-foreground/80">{description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
