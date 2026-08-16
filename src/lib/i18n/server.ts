import { DEFAULT_LOCALE, DICTIONARIES, isLocale, type Dictionary, type Locale } from "./dictionaries";

/**
 * Dictionary lookup for Server Components.
 *
 * The locale is a route segment, so every page already has it in `params` —
 * no context, no cookie, and nothing that would force the page out of static
 * generation. An unknown segment falls back to the default rather than
 * throwing: the route matcher should make that impossible, but a 500 is a poor
 * trade for a bad URL.
 */
export function dictionaryFor(raw: string): Dictionary {
  return DICTIONARIES[isLocale(raw) ? raw : DEFAULT_LOCALE];
}

export async function getDictionary(
  params: Promise<{ locale: string }>,
): Promise<{ locale: Locale; t: Dictionary }> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return { locale, t: DICTIONARIES[locale] };
}
