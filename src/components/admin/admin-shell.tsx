"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { adminNavItems } from "@/components/admin/admin-nav";
import { logout } from "@/lib/actions/auth/logout.action";
import type { AdminRole } from "@/generated/prisma/enums";

function NavLinks({ role, onNavigate }: { role: AdminRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = adminNavItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  adminName,
  adminEmail,
  adminRole,
  children,
}: {
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="px-5 py-5">
          <Link href="/admin" className="font-heading text-lg font-bold">
            CIMS <span className="font-normal">Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <NavLinks role={adminRole} />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-2 truncate text-sm font-medium">{adminName}</div>
          <div className="mb-3 truncate text-xs text-sidebar-foreground/60">{adminEmail}</div>
          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
          <Link href="/admin" className="font-heading text-lg font-bold text-primary">
            CIMS Admin
          </Link>
          <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </header>

        <main className="flex-1 bg-secondary/30 p-6">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground">
          <SheetHeader>
            <SheetTitle className="text-sidebar-foreground">CIMS Admin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 pb-4">
            <NavLinks role={adminRole} onNavigate={() => setMobileOpen(false)} />
            <div className="mt-6 border-t border-sidebar-border pt-4">
              <div className="mb-2 truncate text-sm font-medium">{adminName}</div>
              <div className="mb-3 truncate text-xs text-sidebar-foreground/60">{adminEmail}</div>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <LogOut className="size-4" /> Sign out
                </Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
