import Link from "next/link";
import { Bookmark } from "lucide-react";
import { isNavGroup, NAV, SITE } from "@/lib/site";
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
export default function SiteHeader() {
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
                <li key={entry.label} data-tour={entry.key ? `nav-${entry.key}` : undefined}>
                  <NavDropdown label={entry.label} navKey={entry.key} items={entry.items} />
                </li>
              ) : (
                <li key={entry.href} data-tour={entry.key ? `nav-${entry.key}` : undefined}>
                  <NavLinkItem href={entry.href} label={entry.label} navKey={entry.key} />
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <span data-tour="search">
            <SearchTrigger />
          </span>
          <Link
            href="/bookmark"
            data-tour="bookmark"
            aria-label="Bookmark"
            title="Bookmark"
            className="press hover:bg-accent hidden size-9 items-center justify-center sm:inline-flex"
          >
            <Bookmark className="size-4" aria-hidden />
          </Link>
          <span data-tour="language">
            <LanguageSwitcher />
          </span>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
