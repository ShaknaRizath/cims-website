import {
  LayoutDashboard,
  GraduationCap,
  Newspaper,
  CalendarDays,
  Quote,
  Users,
  Building2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/programmes", label: "Programmes", icon: GraduationCap },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/campuses", label: "Campuses", icon: Building2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
