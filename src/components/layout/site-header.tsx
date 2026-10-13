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
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1600px] min-w-0 items-center gap-0 px-3 min-[400px]:gap-1 sm:px-6">
        <Link
          href="/"
          className="press mr-1 flex min-w-0 shrink items-center whitespace-nowrap sm:mr-3"
        >
          <span className="font-display text-lg leading-none font-extrabold tracking-tight uppercase sm:text-xl">
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
              )
            )}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0 min-[400px]:gap-1">
          <span data-tour="search">
            <SearchTrigger />
          </span>
          <Link
            href="/bookmark"
            data-tour="bookmark"
            aria-label="Bookmark"
            title="Bookmark"
            className="press hidden size-9 items-center justify-center hover:bg-accent sm:inline-flex"
          >
            <Bookmark className="size-4" aria-hidden />
          </Link>
          <span data-tour="language" className="hidden min-[400px]:inline-flex">
            <LanguageSwitcher />
          </span>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
