import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/dictionaries";
import { LOCALE_REWRITE_HEADER } from "@/lib/i18n/internal";

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
 * The mirror rule — surfacing an internal `/id/...` URL as the canonical bare
 * path — lives in `redirects()` in `next.config.ts`, not here. `redirects` run
 * *before* the proxy and only against the incoming URL, whereas this function
 * also runs on the path it just rewrote to: redirecting `/id/...` from here
 * bounced `/tv` → `/id/tv` → `/tv` forever in a production build.
 *
 * This is what lets all three locales stay static — resolving the language from
 * a cookie in a layout would opt the entire app out of static generation.
 */
function headerEntries(request: NextRequest): Record<string, string> {
  return Object.fromEntries(request.headers.entries());
}

const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already addressed with a locale prefix — nothing to do.
  if (PREFIXED.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  // Already rewritten to the internal default-locale path — serve it as is.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;

  // The marker header is what stops the loop. A production build re-runs the
  // whole pipeline — config redirects included — against the rewritten path, so
  // the canonical `/id/... -> /...` redirect would fire on our own rewrite and
  // bounce forever. The redirect in `next.config.ts` is declared `missing` this
  // header, so it applies to real visitors and skips this internal pass.
  return NextResponse.rewrite(url, {
    request: { headers: new Headers({ ...headerEntries(request), [LOCALE_REWRITE_HEADER]: "1" }) },
  });
}

export const config = {
  // Everything except Next internals, the API routes and the SEO files, which
  // are locale-independent and live outside `app/[locale]`.
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|opengraph-image).*)",
  ],
};
