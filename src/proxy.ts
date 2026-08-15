import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/dictionaries";

/**
 * Locale routing that keeps existing URLs intact.
 *
 * Every route lives under `app/[locale]`, but the Indonesian site must stay on
 * unprefixed paths — there are ~2,000 indexed URLs and moving them all to `/id`
 * would throw away the SEO this project was rebuilt to earn.
 *
 * So a *rewrite*, not a redirect: `/anime/foo` is served internally by
 * `/id/anime/foo` while the browser and crawlers keep seeing `/anime/foo`.
 * `/en/...` and `/ja/...` pass through untouched and are their own statically
 * generated pages, linked to the default via `hreflang`.
 *
 * This is what lets all three locales stay static — resolving the language from
 * a cookie in a layout would opt the entire app out of static generation.
 */
const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already addressed with a locale prefix — nothing to do.
  if (PREFIXED.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  // `/id/...` is internal only; surface it as the canonical unprefixed URL.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, the API routes and the SEO files, which
  // are locale-independent and live outside `app/[locale]`.
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|opengraph-image).*)",
  ],
};
