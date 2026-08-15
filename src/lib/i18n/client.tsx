"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, DICTIONARIES, type Dictionary, type Locale } from "./dictionaries";

const LocaleContext = createContext<{ locale: Locale; t: Dictionary }>({
  locale: DEFAULT_LOCALE,
  t: DICTIONARIES[DEFAULT_LOCALE],
});

/** Seeded by the server so the first client render already has the right copy. */
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
