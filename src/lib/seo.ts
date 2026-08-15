/**
 * Build a meta description.
 *
 * Upstream text fields are often present but empty (`""`), and `??` only falls
 * through on null/undefined — which silently produced pages with no description
 * at all. This treats blank as missing.
 */
export function metaDescription(primary: string | null | undefined, fallback: string): string {
  const text = primary?.trim();
  if (!text) return fallback;
  return text.length > 300 ? `${text.slice(0, 297).trimEnd()}…` : text;
}
