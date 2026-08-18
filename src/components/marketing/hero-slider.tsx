"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 5000;
const FADE_DURATION_MS = 1000;

export function HeroSlider({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (images.length <= 1 || reducedMotionRef.current) return;
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          unoptimized
          priority={index === 0}
          className={cn(
            "object-cover object-right transition-opacity ease-in-out motion-reduce:transition-none",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 sm:bottom-8 sm:left-8">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className="group flex items-center justify-center rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === activeIndex
                    ? "w-6 bg-primary-foreground"
                    : "w-1.5 bg-primary-foreground/40 group-hover:bg-primary-foreground/70",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
