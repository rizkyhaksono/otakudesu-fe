/**
 * Hosts whose CDNs sit behind Cloudflare challenges or drop connections.
 * Routing them through `/_next/image` makes *our* origin wait on theirs —
 * which is what produced the Cloudflare 500s on this site.
 */
const SKIP_OPTIMIZER =
  /(^|\.)(otakudesu\.(blog|best|cloud)|komiku\.(org|to|id)|kiryuuid\.net|uqni\.net)$/i;

export function skipImageOptimizer(src: string | null | undefined): boolean {
  if (!src) return false;
  try {
    return SKIP_OPTIMIZER.test(new URL(src).hostname);
  } catch {
    return false;
  }
}
