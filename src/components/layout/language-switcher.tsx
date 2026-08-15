"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Languages } from "lucide-react";
import { DEFAULT_LOCALE, LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n/dictionaries";
import { useI18n } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Switching language is a navigation, not a state change.
 *
 * Each locale is its own statically generated URL, so these are plain links —
 * they prefetch, they work in a new tab, they are crawlable, and the target
 * page arrives already rendered in the right language.
 */
export default function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /** Strip any existing prefix, then apply the new one. Default stays bare. */
  const hrefFor = (next: Locale) => {
    let base = pathname || "/";
    for (const option of LOCALES) {
      if (base === `/${option}`) base = "/";
      else if (base.startsWith(`/${option}/`)) base = base.slice(`/${option}`.length);
    }
    if (next === DEFAULT_LOCALE) return base;
    return base === "/" ? `/${next}` : `/${next}${base}`;
  };

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label={t.nav.language}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <Languages className="size-4" aria-hidden />
      </Button>

      <ul
        className={cn(
          "bg-popover absolute top-full right-0 z-50 w-44 border transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {LOCALES.map((option) => (
          <li key={option} className="border-b last:border-b-0">
            <Link
              href={hrefFor(option)}
              hrefLang={option}
              onClick={() => setOpen(false)}
              aria-current={option === locale ? "true" : undefined}
              className={cn(
                "press block px-3 py-2 text-sm",
                option === locale
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "hover:bg-accent",
              )}
            >
              {LOCALE_NAMES[option]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
