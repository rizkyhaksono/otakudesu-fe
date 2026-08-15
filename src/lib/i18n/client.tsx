"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  isLocale,
  type Dictionary,
  type Locale,
} from "./dictionaries";

export const LOCALE_COOKIE = "natee.locale";

/**
 * The locale is resolved on the *client*, deliberately.
 *
 * Reading the cookie on the server (in the root layout) opts every route out of
 * static generation — it turned the whole site dynamic and killed ISR and CDN
 * caching, which is far more costly than a brief chrome swap. Since only the
 * site's chrome is translated and the catalogue itself is Indonesian, the
 * server can safely render the default locale and let the client adjust.
 */
function readCookieLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(/(?:^|;\s*)natee\.locale=([^;]+)/);
  const value = match?.[1];
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

/** Called by the switcher so the UI updates without a reload. */
export function notifyLocaleChanged() {
  for (const listener of listeners) listener();
}

const LocaleContext = createContext<{ locale: Locale; t: Dictionary } | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readCookieLocale, () => DEFAULT_LOCALE);

  return (
    <LocaleContext.Provider value={{ locale, t: DICTIONARIES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  return (
    useContext(LocaleContext) ?? { locale: DEFAULT_LOCALE, t: DICTIONARIES[DEFAULT_LOCALE] }
  );
}
