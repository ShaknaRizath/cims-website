import { WhatsappIcon } from "@/components/marketing/social-icons";

const DEFAULT_MESSAGE = "Hi CIMS Campus, I'd like to know more about your programmes.";

function toWaLink(rawNumber: string) {
  const digitsOnly = rawNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
}

export function WhatsAppWidget({ whatsappNumber }: { whatsappNumber?: string | null }) {
  if (!whatsappNumber) return null;

  return (
    <a
      href={toWaLink(whatsappNumber)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with CIMS Campus on WhatsApp"
      className="group fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#25D366]/50 motion-reduce:transition-none sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/60 motion-reduce:hidden" />
      <WhatsappIcon className="size-7" />
      <span
        role="tooltip"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-sm text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
      >
        Chat on WhatsApp
      </span>
    </a>
  );
}
