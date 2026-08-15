"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/lib/i18n/client";

/**
 * Client-side context only. Redux and redux-persist are gone — data now comes
 * from Server Components, so nothing needs a store.
 *
 * The theme provider is rendered normally rather than through
 * `dynamic(..., { ssr: false })`, which previously skipped the entire subtree
 * during SSR and left crawlers with an empty document.
 *
 * The locale is resolved inside `LocaleProvider` from the cookie, on the client.
 * Resolving it on the server would make every route dynamic and disable ISR.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </LocaleProvider>
  );
}
