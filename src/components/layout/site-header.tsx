import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import ThemeToggle from "@/components/layout/theme-toggle";
import MobileNav from "@/components/layout/mobile-nav";
import SearchTrigger from "@/components/layout/search-trigger";

/**
 * Server component: the whole navigation ships as HTML, which is what gives
 * crawlers a complete internal link graph on every page.
 */
export default function SiteHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-display text-xl leading-none font-extrabold tracking-tight uppercase">
            {SITE.name}
          </span>
          <span className="bg-primary text-primary-foreground hidden px-1 py-0.5 font-mono text-[0.6rem] leading-none tracking-widest uppercase sm:inline-block">
            beta
          </span>
        </Link>

        <nav aria-label="Utama" className="hidden flex-1 lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-primary text-muted-foreground px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <SearchTrigger />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
