"use client";

import Link from "next/link";
import { ANIME_LINKS, NAV_FLAT, SITE } from "@/lib/site";
import TourTrigger from "@/components/onboarding/tour-trigger";
import { useI18n } from "@/lib/i18n/client";

const EXPLORE = ANIME_LINKS;

/**
 * Everything that is not anime-specific. Derived rather than sliced by index:
 * the previous `slice(6)` shifted when the comic links were added, which is how
 * Bookmark ended up rendered twice.
 */
const OTHER = NAV_FLAT.filter(
  (item) => !ANIME_LINKS.some((link) => link.href === item.href) && item.href !== "/",
).filter(
  (item, index, all) => all.findIndex((other) => other.href === item.href) === index,
);

export default function SiteFooter() {
  const { t } = useI18n();

  /** Nav entries carry a dictionary key; the Indonesian label is the fallback. */
  const label = (item: { key?: string; label: string }) =>
    (item.key && (t.nav as Record<string, string>)[item.key]) || item.label;

  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-extrabold tracking-tight uppercase">
              {SITE.name}
            </p>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm">{SITE.description}</p>
          </div>

          <div>
            <p className="eyebrow">{t.pages.footer.explore}</p>
            <ul className="mt-3 space-y-1.5">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {label(item)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">{t.pages.footer.other}</p>
            <ul className="mt-3 space-y-1.5">
              {OTHER.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {label(item)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">{t.pages.footer.project}</p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <a
                  href={SITE.github}
                  className="text-muted-foreground hover:text-foreground text-sm"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t.pages.footer.sourceCode}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rizkyhaksono/otakudesu-be"
                  className="text-muted-foreground hover:text-foreground text-sm"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t.pages.footer.publicApi}
                </a>
              </li>
              <li>
                <TourTrigger />
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-10 border-t pt-6 text-xs">
          <p>
            {t.pages.footer.disclaimer}
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.name} · {t.pages.footer.license}
          </p>
        </div>
      </div>
    </footer>
  );
}
