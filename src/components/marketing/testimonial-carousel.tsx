"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TestimonialCard, type TestimonialCardData } from "@/components/marketing/testimonial-card";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY_MS = 6000;

export function TestimonialCarousel({ testimonials }: { testimonials: TestimonialCardData[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!api) return;
    // Syncs initial selected-slide state from the embla api on mount, same as ui/carousel.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused || reducedMotionRef.current || testimonials.length <= 1) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_DELAY_MS);
    return () => clearInterval(id);
  }, [api, isPaused, testimonials.length]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  if (testimonials.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <Carousel setApi={setApi} opts={{ loop: testimonials.length > 1, align: "start" }}>
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
              <TestimonialCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {testimonials.length > 1 && (
          <>
            <CarouselPrevious size="icon" className="-left-3 sm:-left-4" />
            <CarouselNext size="icon" className="-right-3 sm:-right-4" />
          </>
        )}
      </Carousel>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonials">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Show testimonial from ${testimonial.studentName}`}
              onClick={() => scrollTo(index)}
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

      <p className="sr-only" role="status" aria-live="polite">
        Showing testimonial {selectedIndex + 1} of {testimonials.length}
      </p>
    </div>
  );
}
