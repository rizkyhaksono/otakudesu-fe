/**
 * Marker the proxy puts on its own locale rewrite.
 *
 * Shared by `src/proxy.ts` and `next.config.ts` because the two have to agree
 * exactly: the proxy sets it, and the canonical `/id/... -> /...` redirect is
 * declared `missing` it so the redirect never fires on the proxy's own rewrite.
 */
export const LOCALE_REWRITE_HEADER = "x-natee-locale-rewrite";
