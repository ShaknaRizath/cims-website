// lucide-react no longer ships brand/social icons (Facebook, Instagram, LinkedIn,
// YouTube) — these are minimal hand-authored brand-mark SVGs instead of pulling in
// a whole icon-pack dependency for four glyphs. Sized via `className` like lucide icons.

import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.86.24-1.5 1.53-1.5H16.5V4.35C16.24 4.32 15.36 4.25 14.33 4.25c-2.15 0-3.63 1.31-3.63 3.72V10.5H8.2v3h2.5V21h2.8z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 8.75h3.4V21h-3.4V8.75zM10.1 8.75h3.26v1.68h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.08 2.27 4.08 5.22V21h-3.4v-6.35c0-1.52-.03-3.47-2.11-3.47-2.12 0-2.44 1.66-2.44 3.36V21h-3.4V8.75z" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.2s-.21-1.49-.86-2.14c-.82-.86-1.74-.86-2.16-.91C15.6 4 12 4 12 4h-.01s-3.6 0-6.58.15c-.42.05-1.34.05-2.16.91C2.6 5.71 2.4 7.2 2.4 7.2S2.2 8.95 2.2 10.7v1.6c0 1.75.2 3.5.2 3.5s.21 1.49.86 2.14c.82.86 1.9.83 2.38.92C7.4 19 12 19.04 12 19.04s3.6-.01 6.58-.16c.42-.05 1.34-.05 2.16-.91.65-.65.86-2.14.86-2.14s.2-1.75.2-3.5v-1.6c0-1.75-.2-3.5-.2-3.5zM9.98 14.35V9l5.4 2.68-5.4 2.67z" />
    </svg>
  );
}
