"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Landmark } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface PartnerUniversityData {
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}

export function PartnerUniversityCarousel({ partners }: { partners: PartnerUniversityData[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (partners.length === 0) return null;

  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: partners.length > 3, align: "start" }}>
        <CarouselContent>
          {partners.map((partner) => {
            const logo = (
              <div className="flex h-80 w-full items-center justify-center rounded-lg border bg-card p-12">
                {partner.logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image src={partner.logoUrl} alt={partner.name} fill unoptimized className="object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Landmark className="size-14" />
                    <span className="text-base font-medium">{partner.name}</span>
                  </div>
                )}
              </div>
            );

            return (
              <CarouselItem key={partner.name} className="basis-full sm:basis-1/2">
                {partner.websiteUrl ? (
                  <a href={partner.websiteUrl} target="_blank" rel="noreferrer" aria-label={partner.name} className="block">
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {partners.length > 1 && (
          <>
            <CarouselPrevious size="icon" className="-left-3 sm:-left-4" />
            <CarouselNext size="icon" className="-right-3 sm:-right-4" />
          </>
        )}
      </Carousel>

      {partners.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Partner universities">
          {partners.map((partner, index) => (
            <button
              key={partner.name}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Show ${partner.name}`}
              onClick={() => api?.scrollTo(index)}
              className="group flex items-center justify-center rounded-full p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === selectedIndex ? "w-6 bg-primary" : "w-2 bg-primary/30 group-hover:bg-primary/50",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
