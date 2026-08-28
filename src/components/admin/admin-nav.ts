import {
  LayoutDashboard,
  GraduationCap,
  Newspaper,
  CalendarDays,
  Quote,
  Users,
  Building2,
  Landmark,
  GalleryHorizontal,
  Mail,
  Tag,
  Settings,
  FileText,
  UserCog,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "@/generated/prisma/enums";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  // Explicit allowlist (no implicit default) since this drives access-sensitive
  // nav visibility — ADMISSIONS_OFFICER accounts should only ever see Applications.
  roles: AdminRole[];
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN"] },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: GalleryHorizontal, roles: ["ADMIN"] },
  { href: "/admin/programmes", label: "Programmes", icon: GraduationCap, roles: ["ADMIN"] },
  { href: "/admin/categories", label: "Categories", icon: Tag, roles: ["ADMIN"] },
  { href: "/admin/news", label: "News", icon: Newspaper, roles: ["ADMIN"] },
  { href: "/admin/events", label: "Events", icon: CalendarDays, roles: ["ADMIN"] },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote, roles: ["ADMIN"] },
  { href: "/admin/team", label: "Team", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/campuses", label: "Campuses", icon: Building2, roles: ["ADMIN"] },
  { href: "/admin/partners", label: "Partner Universities", icon: Landmark, roles: ["ADMIN"] },
  {
    href: "/admin/applications",
    label: "Applications",
    icon: FileText,
    roles: ["ADMIN", "ADMISSIONS_OFFICER"],
  },
  { href: "/admin/contact-messages", label: "Contact Messages", icon: Mail, roles: ["ADMIN"] },
  {
    href: "/admin/certificate-verification-requests",
    label: "Certificate Verification",
    icon: ShieldCheck,
    roles: ["ADMIN"],
  },
  { href: "/admin/admins", label: "Admin Users", icon: UserCog, roles: ["ADMIN"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["ADMIN"] },
];
