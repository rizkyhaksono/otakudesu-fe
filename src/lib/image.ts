/**
 * Only the hosts that actually serve images we render. `next/image` treats this
 * as an allowlist, so it doubles as protection against being used as an open
 * image proxy.
 */
export const IMAGE_HOSTS = [
  // Anime posters
  "otakudesu.blog",
  "otakudesu.best",
  "otakudesu.cloud",
  // Comic covers and page images. Wildcards on purpose: these CDNs move between
  // subdomains (thumbnail./img./image2…14.) and a fixed list silently breaks
  // images every time they do — which is exactly what happened with the old
  // comic source.
  "**.komiku.org",
  "**.komiku.to",
  "**.komiku.id",
  // TMDB stills and posters
  "image.tmdb.org",
  // Article images from the news source
  "**.animenewsnetwork.com",
  // Live TV channel logos
  "i.imgur.com",
  "**.iptv-org.github.io",
] as const;

/**
 * Hosts whose CDNs sit behind Cloudflare challenges or drop connections.
 * Routing them through `/_next/image` makes *our* origin wait on theirs —
 * which is what produced the Cloudflare 500s on this site.
 */
const SKIP_OPTIMIZER =
  /(^|\.)(otakudesu\.(blog|best|cloud)|komiku\.(org|to|id))$/i;

/** Same matching as `remotePatterns`: `**.host` means any subdomain of `host`. */
export function isAllowedImageHost(hostname: string): boolean {
  return IMAGE_HOSTS.some((pattern) =>
    pattern.startsWith("**.") ? hostname.endsWith(pattern.slice(2)) : hostname === pattern,
  );
}

/**
 * Also true for hosts outside the allowlist. Komiku links some covers straight
 * from third-party sites (comicvine.gamespot.com), and `next/image` throws —
 * failing the whole page render — when an optimized `src` is not allowlisted.
 * Rendering those directly keeps the optimizer closed to arbitrary hosts.
 */
export function skipImageOptimizer(src: string | null | undefined): boolean {
  if (!src) return false;
  try {
    const { hostname } = new URL(src);
    return SKIP_OPTIMIZER.test(hostname) || !isAllowedImageHost(hostname);
  } catch {
    return false;
  }
}
