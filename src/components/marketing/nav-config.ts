export interface NavLink {
  label: string;
  href: string;
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
    items: [
      { label: "Engineering & Technology", href: "/programmes?category=engineering-technology" },
      { label: "Business & Economics", href: "/programmes?category=business-economics" },
      { label: "Law & Education", href: "/programmes?category=law-education" },
      { label: "Study Abroad", href: "/programmes?category=study-abroad" },
    ],
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
    ],
  },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export interface UtilityNavSettings {
  lmsUrl: string;
  certificateVerifyUrl: string;
  onlinePaymentUrl: string;
}

export function buildUtilityNav(settings: UtilityNavSettings): NavLink[] {
  return [
    { label: "Online Learning Portal", href: settings.lmsUrl },
    { label: "Certificate Verification", href: settings.certificateVerifyUrl },
    { label: "Online Payment", href: settings.onlinePaymentUrl },
  ];
}
