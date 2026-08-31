export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  href: string;
  items: NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

export const primaryNav: NavEntry[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Programmes",
    href: "/programmes",
    // Filled in at render time from the ProgrammeCategory table (see Header) —
    // kept empty here since this file has no DB access.
    items: [],
  },
  {
    label: "Success Stories",
    href: "/success-stories",
    items: [
      { label: "Testimonials", href: "/success-stories" },
      { label: "CSR", href: "/success-stories/csr" },
      { label: "Sponsored Programmes", href: "/success-stories/sponsored-programmes" },
      { label: "Career Guidance", href: "/success-stories/career-guidance" },
    ],
  },
  {
    label: "Team",
    href: "/team",
    items: [
      { label: "Board of Governors", href: "/team?category=BOARD_OF_GOVERNORS" },
      { label: "Academic Board", href: "/team?category=ACADEMIC_BOARD" },
      { label: "International Representatives", href: "/team?category=INTERNATIONAL_REPRESENTATIVE" },
      { label: "Academic Panel", href: "/team?category=ACADEMIC_PANEL" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export interface UtilityNavSettings {
  lmsUrl: string;
  onlinePaymentUrl: string;
}

export function buildUtilityNav(settings: UtilityNavSettings): NavLink[] {
  return [
    { label: "Online Learning Portal", href: settings.lmsUrl, external: true },
    { label: "Certificate Verification", href: "/certificate-verification" },
    { label: "Online Payment", href: settings.onlinePaymentUrl, external: true },
  ];
}
