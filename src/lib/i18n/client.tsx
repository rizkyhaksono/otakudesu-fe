"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, DICTIONARIES, type Dictionary, type Locale } from "./dictionaries";

const LocaleContext = createContext<{ locale: Locale; t: Dictionary }>({
  locale: DEFAULT_LOCALE,
  t: DICTIONARIES[DEFAULT_LOCALE],
});

/**
 * Seeded from the route segment, not from a cookie.
 *
 * The locale is part of the URL, so the server already knows it at build time —
 * every page stays statically generated and client components render the right
 * language on the very first paint, with no post-hydration swap.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, t: DICTIONARIES[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  return useContext(LocaleContext);
}
