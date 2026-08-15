import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, DICTIONARIES, isLocale, type Dictionary, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "natee.locale";

/**
 * Locale lives in a cookie, not in the URL.
 *
 * The catalogue itself is Indonesian — titles and synopses come from Indonesian
 * upstreams — so `/en` and `/ja` routes would serve near-identical pages under
 * different URLs and invite duplicate-content penalties on a site whose SEO we
 * deliberately built up. Only the chrome is translated, so a cookie is the
 * honest mechanism: one canonical URL per piece of content.
 */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}
