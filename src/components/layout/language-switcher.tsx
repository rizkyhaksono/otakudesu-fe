"use client";

import { useState, useTransition } from "react";
import { Languages } from "lucide-react";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n/dictionaries";
import { notifyLocaleChanged, useI18n } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const choose = async (next: Locale) => {
    setOpen(false);
    if (next === locale) return;

    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });

    // Nothing server-rendered depends on the locale, so just tell the client
    // store — no refetch, no round-trip.
    startTransition(() => notifyLocaleChanged());
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
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
      >
        <Languages className="size-4" aria-hidden />
      </Button>

      <ul
        className={cn(
          "bg-popover absolute right-0 top-full z-50 w-44 border transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {LOCALES.map((option) => (
          <li key={option} className="border-b last:border-b-0">
            <button
              type="button"
              onClick={() => void choose(option)}
              aria-current={option === locale}
              className={cn(
                "press w-full px-3 py-2 text-left text-sm",
                option === locale ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
              )}
            >
              {LOCALE_NAMES[option]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
