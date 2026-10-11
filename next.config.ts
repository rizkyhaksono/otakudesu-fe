import type { NextConfig } from "next";
import { LOCALE_REWRITE_HEADER } from "./src/lib/i18n/internal";
import { IMAGE_HOSTS } from "./src/lib/image";

/*
 * Video hosts cannot be a fixed allowlist.
 *
 * Anime mirrors resolve to whichever CDN the upstream picked that day —
 * filedon.co, odvidhide.com, mega.nz, desustream.net, blogger.com and others
 * rotate constantly — and the film providers rotate their own domains too. A
 * static list silently blocks the player, which is exactly what happened:
 * every mirror rendered "This content is blocked".
 *
 * So `frame-src` allows https: and the real protection is the iframe `sandbox`
 * on every player, which withholds top-navigation and popups. Those hosts also
 * never receive our origin (`referrerPolicy="origin"`) and cannot reach our DOM.
 */
const FRAME_SRC = "https:";

const isDev = process.env.NODE_ENV === "development";

/*
 * Static CSP rather than a per-request nonce.
 *
 * Nonces would force every page into dynamic rendering, which disables ISR and
 * CDN caching — the opposite of what this rewrite is for. A strict allowlist
 * gets most of the benefit while the pages stay static.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "media-src 'self' blob: https: http:",
  "font-src 'self' data:",
  "connect-src 'self' https: http: https://cloudflareinsights.com",
  `frame-src 'self' ${FRAME_SRC}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
    formats: ["image/avif", "image/webp"],
    // Poster rails and TMDB stills never need 2k/4k variants. The default
    // 2048/3840 widths made `/_next/image` srcsets that the optimizer then
    // tried to fetch from Cloudflare-fronted CDNs, which is what timed out.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  async headers() {
    const security = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];

    return [
      { source: "/:path*", headers: security },
      // Hashed assets are immutable. Cloudflare caches these by extension.
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Extensionless, so Cloudflare ignores it unless a Cache Rule exists.
      // CDN-Cache-Control is what Cloudflare actually honors when the rule
      // is "Eligible for cache".
      {
        source: "/_next/image",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
          { key: "CDN-Cache-Control", value: "public, max-age=604800" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      /*
       * `/id/...` is the internal form of the default locale; the canonical
       * URL is the bare path, so visitors and crawlers are sent there.
       *
       * A production build re-runs the whole request pipeline against the path
       * the proxy rewrote to, which means these rules also see the proxy's own
       * `/id/...` — and `/tv` bounced to `/id/tv` and back forever. The proxy
       * therefore tags its rewrite with a header, and `missing` makes these
       * rules skip that internal pass while still catching real requests.
       */
      {
        source: "/id",
        destination: "/",
        permanent: true,
        missing: [{ type: "header", key: LOCALE_REWRITE_HEADER }],
      },
      {
        source: "/id/:path*",
        destination: "/:path*",
        permanent: true,
        missing: [{ type: "header", key: LOCALE_REWRITE_HEADER }],
      },

      // Legacy query-string pagination -> path segments, which index far better.
      { source: "/anime", destination: "/search", permanent: true },
      { source: "/comic/chapter/:slug", destination: "/comic", permanent: false },
      { source: "/movie/detail/:id", destination: "/movie/:id", permanent: true },
      { source: "/movie/genre", destination: "/movie", permanent: true },
    ];
  },
};

export default nextConfig;
