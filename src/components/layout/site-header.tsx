import Link from "next/link";
import { Bookmark } from "lucide-react";
import { isNavGroup, NAV, SITE } from "@/lib/site";
import { getLocale } from "@/lib/i18n/server";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import LanguageSwitcher from "@/components/layout/language-switcher";
import ThemeToggle from "@/components/layout/theme-toggle";
import MobileNav from "@/components/layout/mobile-nav";
import SearchTrigger from "@/components/layout/search-trigger";
import NavDropdown from "@/components/layout/nav-dropdown";
import NavLinkItem from "@/components/layout/nav-link";

/**
 * Server component: the whole navigation ships as HTML, which is what gives
 * crawlers a complete internal link graph on every page.
 */
export default async function SiteHeader() {
  const t = DICTIONARIES[await getLocale()];
  const label = (key: string | undefined, fallback: string) =>
    (key && (t.nav as Record<string, string>)[key]) || fallback;

  return (
    <header className="bg-background/90 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-1 px-4 sm:px-6">
        <Link href="/" className="press mr-3 flex items-center whitespace-nowrap">
          <span className="font-display text-xl leading-none font-extrabold tracking-tight uppercase">
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Utama" className="hidden flex-1 lg:block">
          <ul className="flex items-center">
            {NAV.map((entry) =>
              isNavGroup(entry) ? (
                <li key={entry.label}>
                  <NavDropdown
                    label={label(entry.key, entry.label)}
                    items={entry.items.map((item) => ({
                      ...item,
                      label: label(item.key, item.label),
                    }))}
                  />
                </li>
              ) : (
                <li key={entry.href}>
                  <NavLinkItem href={entry.href} label={label(entry.key, entry.label)} />
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchTrigger />
          <Link
            href="/bookmark"
            aria-label={t.nav.bookmark}
            title={t.nav.bookmark}
            className="press hover:bg-accent hidden size-9 items-center justify-center sm:inline-flex"
          >
            <Bookmark className="size-4" aria-hidden />
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
