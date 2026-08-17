"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bookmark, ChevronRight, Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { isNavGroup, NAV, SITE, type NavLink } from "@/lib/site";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

/**
 * The mobile menu.
 *
 * Two things this fixes over the previous version:
 *
 * 1. **It actually scrolls.** `SheetContent` is a fixed-height flex column
 *    (`h-full flex flex-col`), and a flex child's default `min-height: auto`
 *    means it never shrinks below its own content — so a list taller than the
 *    sheet just overflowed the fixed panel with nothing to scroll. On a short
 *    viewport (a phone in landscape, a browser with URL bar still showing,
 *    smaller Android devices) that clipped the tail of the menu outright.
 *    The nav list is now the one flex child carrying `min-h-0 overflow-y-auto`,
 *    with the header staying fixed above it and safe-area padding below it so
 *    the last row never sits under an iOS home indicator.
 * 2. **It mirrors the desktop grouping** (Anime / Komik / Lainnya) instead of
 *    one flat, undifferentiated list of sixteen links — the same reasoning
 *    that grouped the desktop dropdowns in the first place applies here even
 *    more: a phone screen has less room to scan a flat list in.
 */
export default function MobileNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const tr = (key: string | undefined, fallback: string) =>
    (key && (t.nav as Record<string, string>)[key]) || fallback;
  const desc = (key: string | undefined, fallback?: string) =>
    (key && (t.navDesc as Record<string, string>)[key]) || fallback;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkClass = (href: string) =>
    cn(
      "press hover:bg-accent flex items-center justify-between gap-2 px-4 py-3 text-sm",
      isActive(href) ? "text-primary font-semibold" : "font-medium",
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 lg:hidden" aria-label={t.nav.menu}>
          <Menu className="size-4" aria-hidden />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-72 flex-col gap-0 p-0 sm:w-80">
        <SheetHeader className="shrink-0 border-b p-4">
          <SheetTitle className="font-display text-left text-lg font-extrabold uppercase">
            {SITE.name}
          </SheetTitle>
        </SheetHeader>

        {/* The scrollable region: `min-h-0` is what makes `overflow-y-auto`
            actually take effect inside a flex column, and `overscroll-contain`
            stops a scroll-to-the-end from also dragging the page behind it. */}
        <nav
          aria-label={t.nav.menu}
          className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]"
        >
          <ul className="grid grid-cols-2 gap-px border-b bg-border [&>*]:bg-background">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(
                  "press hover:bg-accent flex items-center gap-2 px-4 py-3 text-sm",
                  isActive("/") ? "text-primary font-semibold" : "font-medium",
                )}
              >
                <Home className="size-4 shrink-0" aria-hidden />
                {t.common.home}
              </Link>
            </li>
            <li>
              <Link
                href="/bookmark"
                onClick={() => setOpen(false)}
                className={cn(
                  "press hover:bg-accent flex items-center gap-2 px-4 py-3 text-sm",
                  isActive("/bookmark") ? "text-primary font-semibold" : "font-medium",
                )}
              >
                <Bookmark className="size-4 shrink-0" aria-hidden />
                {t.nav.bookmark}
              </Link>
            </li>
          </ul>

          {NAV.map((entry) =>
            isNavGroup(entry) ? (
              <div key={entry.label} className="border-b">
                <p className="eyebrow bg-muted/50 px-4 py-2">{tr(entry.key, entry.label)}</p>
                <ul>
                  {entry.items.map((item: NavLink) => (
                    <li key={item.href} className="border-t first:border-t-0">
                      <Link href={item.href} onClick={() => setOpen(false)} className={linkClass(item.href)}>
                        <span className="min-w-0">
                          <span className="block truncate">{tr(item.key, item.label)}</span>
                          {item.description ? (
                            <span className="text-muted-foreground block truncate text-xs font-normal">
                              {desc(item.key, item.description)}
                            </span>
                          ) : null}
                        </span>
                        <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div key={entry.href} className="border-b">
                <Link href={entry.href} onClick={() => setOpen(false)} className={linkClass(entry.href)}>
                  {tr(entry.key, entry.label)}
                  <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
                </Link>
              </div>
            ),
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
