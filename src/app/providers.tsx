"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

/**
 * Client-side context only. Redux and redux-persist are gone — data now comes
 * from Server Components, so nothing needs a store.
 *
 * The theme provider is rendered normally rather than through
 * `dynamic(..., { ssr: false })`, which previously skipped the entire subtree
 * during SSR and left crawlers with an empty document.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
