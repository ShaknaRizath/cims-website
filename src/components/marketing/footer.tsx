import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { primaryNav, isNavGroup, buildUtilityNav, type UtilityNavSettings } from "@/components/marketing/nav-config";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/marketing/social-icons";

export interface FooterSettings extends UtilityNavSettings {
  contactPhone: string;
  contactEmail: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface FooterCampus {
  id: string;
  name: string;
  city: string;
}

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export function Footer({ settings, campuses }: { settings: FooterSettings; campuses: FooterCampus[] }) {
  const quickLinks = primaryNav.flatMap((entry) => (isNavGroup(entry) ? [] : [entry]));
  const utilityNav = buildUtilityNav(settings);
  const socialLinks = [
    settings.facebookUrl && { label: "Facebook", href: settings.facebookUrl, icon: FacebookIcon },
    settings.instagramUrl && { label: "Instagram", href: settings.instagramUrl, icon: InstagramIcon },
    settings.linkedinUrl && { label: "LinkedIn", href: settings.linkedinUrl, icon: LinkedinIcon },
    settings.youtubeUrl && { label: "YouTube", href: settings.youtubeUrl, icon: YoutubeIcon },
  ].filter((link): link is { label: string; href: string; icon: typeof FacebookIcon } => Boolean(link));

  return (
    <footer className="mt-auto border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="font-heading text-xl font-bold">
            CIMS <span className="font-normal">Campus</span>
          </span>
          <p className="text-sm text-sidebar-foreground/70">
            College of Information Management and Sciences, your faster
            route to higher education since 2006.
          </p>
          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Quick Links
          </h3>
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-sidebar-foreground/80 hover:text-sidebar-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Useful Links
          </h3>
          {utilityNav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-sidebar-foreground/80 hover:text-sidebar-primary"
            >
              {link.label}
            </a>
          ))}
          {legalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-sidebar-foreground/80 hover:text-sidebar-primary"
            >
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-primary">
            <Mail className="size-4" /> {settings.contactEmail}
          </a>
          <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-primary">
            <Phone className="size-4" /> {settings.contactPhone}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Our Campuses
          </h3>
          {campuses.map((campus) => (
            <div key={campus.id} className="flex items-start gap-2 text-sm text-sidebar-foreground/80">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <div>
                <div className="font-medium text-sidebar-foreground">{campus.name}</div>
                <div>{campus.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-sidebar-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} CIMS Campus. All rights reserved.</span>
          <span>College of Information Management and Sciences, est. 2006</span>
        </div>
      </div>
    </footer>
  );
}
