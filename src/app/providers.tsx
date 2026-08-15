"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/dictionaries";

/**
 * Client-side context only. Redux and redux-persist are gone — data now comes
 * from Server Components, so nothing needs a store.
 *
 * The theme provider is rendered normally rather than through
 * `dynamic(..., { ssr: false })`, which previously skipped the entire subtree
 * during SSR and left crawlers with an empty document.
 *
 * `locale` is resolved on the server and passed down, so client components read
 * the same dictionary the server rendered with — no flash of the wrong language.
 */
export default function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <LocaleProvider locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </LocaleProvider>
  );
}
