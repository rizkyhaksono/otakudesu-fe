import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LOCALE,
  DICTIONARIES,
  isLocale,
  LOCALES,
} from "@/lib/i18n/dictionaries";
import Onboarding from "@/components/onboarding/onboarding";
import Providers from "./providers";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import JsonLd from "@/components/seo/json-ld";
import { SITE, absoluteUrl, localeAlternates } from "@/lib/site";

/*
 * Fonts are self-hosted rather than pulled through `next/font/google`.
 *
 * That keeps the production build hermetic — it works in Docker and CI with no
 * network — and means no request ever leaves the user's browser for Google.
 * All three are variable fonts, so one file covers every weight we use.
 */
const inter = localFont({
  src: "../../fonts/Inter.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

/* Condensed grotesk for display type — the wall-of-headline look. */
const archivo = localFont({
  src: "../../fonts/Archivo.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

/* Metadata (episode numbers, ratings, durations) reads as data, not prose. */
const mono = localFont({
  src: "../../fonts/JetBrainsMono.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
  fallback: ["ui-monospace", "monospace"],
});

const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
  ],
};

/**
 * Locale-aware metadata.
 *
 * `hreflang` declares the three locales as translations of one another rather
 * than duplicate content, and the default stays unprefixed so every URL that is
 * already indexed remains the canonical one.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return {
    ...BASE_METADATA,
    alternates: {
      canonical: absoluteUrl("/"),
      languages: localeAlternates("/"),
    },
    openGraph: { ...BASE_METADATA.openGraph, locale },
  };
}

/**
 * One statically generated tree per locale. `generateStaticParams` is what keeps
 * every page prerenderable — the alternative, reading the language from a
 * cookie, makes the whole app dynamic.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = DICTIONARIES[locale];

  return (
    // next-themes mutates <html>, so the hydration suppression belongs here —
    // not on <body>, where it was before and did nothing.
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh antialiased",
          inter.variable,
          archivo.variable,
          mono.variable,
        )}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.url,
            description: SITE.description,
            inLanguage: "id-ID",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: absoluteUrl("/search?q={search_term_string}"),
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <Providers locale={locale}>
          <a
            href="#main"
            className="bg-primary text-primary-foreground sr-only px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
          >
            {t.common.skipToContent}
          </a>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Onboarding />
        </Providers>
      </body>
    </html>
  );
}
