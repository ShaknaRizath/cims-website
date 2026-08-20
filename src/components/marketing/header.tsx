"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { primaryNav, isNavGroup, buildUtilityNav, type UtilityNavSettings } from "@/components/marketing/nav-config";

export interface HeaderSettings extends UtilityNavSettings {
  contactPhone: string;
  contactEmail: string;
}

export interface HeaderProgrammeCategory {
  name: string;
  slug: string;
}

export function Header({
  settings,
  categories,
}: {
  settings: HeaderSettings;
  categories: HeaderProgrammeCategory[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const utilityNav = buildUtilityNav(settings);
  const nav = primaryNav.map((entry) =>
    isNavGroup(entry) && entry.label === "Programmes"
      ? { ...entry, items: categories.map((c) => ({ label: c.name, href: `/programmes?category=${c.slug}` })) }
      : entry,
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="hidden border-b border-border/60 bg-secondary/60 text-secondary-foreground lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" /> {settings.contactPhone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" /> {settings.contactEmail}
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {utilityNav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          CIMS <span className="font-normal text-foreground">Campus</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((entry) =>
            isNavGroup(entry) ? (
              <DropdownMenu key={entry.label}>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="text-sm font-medium" />
                  }
                >
                  {entry.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {entry.items.map((item) => (
                    <DropdownMenuItem key={item.label} render={<Link href={item.href} />}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={entry.label}
                variant="ghost"
                className="text-sm font-medium"
                nativeButton={false}
                render={<Link href={entry.href} />}
              >
                {entry.label}
              </Button>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            className="hidden bg-accent text-accent-foreground hover:bg-accent/90 lg:inline-flex"
            nativeButton={false}
            render={<Link href="/apply" />}
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 overflow-y-auto px-4 pb-4">
            <Accordion className="w-full">
              {nav.map((entry) =>
                isNavGroup(entry) ? (
                  <AccordionItem key={entry.label} value={entry.label}>
                    <AccordionTrigger>{entry.label}</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-2">
                        {entry.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className="border-b py-2.5 text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {entry.label}
                  </Link>
                ),
              )}
            </Accordion>
            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              {utilityNav.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Button
              className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
              nativeButton={false}
              render={<Link href="/apply" onClick={() => setMobileOpen(false)} />}
            >
              Apply Now
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
