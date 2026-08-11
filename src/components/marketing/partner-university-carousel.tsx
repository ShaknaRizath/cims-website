import Image from "next/image";
import { Landmark } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface PartnerUniversityData {
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}

export function PartnerUniversityCarousel({ partners }: { partners: PartnerUniversityData[] }) {
  if (partners.length === 0) return null;

  return (
    <Carousel opts={{ loop: partners.length > 3, align: "start" }} className="px-12">
      <CarouselContent>
        {partners.map((partner) => {
          const logo = (
            <div className="flex h-28 items-center justify-center rounded-lg border bg-card p-6 grayscale opacity-80 transition hover:grayscale-0 hover:opacity-100">
              {partner.logoUrl ? (
                <div className="relative h-full w-full">
                  <Image src={partner.logoUrl} alt={partner.name} fill unoptimized className="object-contain" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Landmark className="size-6" />
                  <span className="text-xs font-medium">{partner.name}</span>
                </div>
              )}
            </div>
          );

          return (
            <CarouselItem key={partner.name} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
              {partner.websiteUrl ? (
                <a href={partner.websiteUrl} target="_blank" rel="noreferrer" aria-label={partner.name}>
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
          <CarouselPrevious size="icon" />
          <CarouselNext size="icon" />
        </>
      )}
    </Carousel>
  );
}
