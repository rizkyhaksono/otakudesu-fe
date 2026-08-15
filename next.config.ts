import type { NextConfig } from "next";
import { LOCALE_REWRITE_HEADER } from "./src/lib/i18n/internal";

/**
 * Only the hosts that actually serve images we render. `next/image` treats this
 * as an allowlist, so it doubles as protection against being used as an open
 * image proxy.
 */
const imageHosts = [
  // Anime posters
  "otakudesu.blog",
  "otakudesu.best",
  "otakudesu.cloud",
  // Comic covers and page images. Wildcards on purpose: these CDNs move between
  // subdomains (thumbnail./img./novel.) and a fixed list silently breaks images
  // every time they do — which is exactly what happened with novel.kiryuuid.net.
  "**.komiku.org",
  "**.komiku.to",
  "**.komiku.id",
  "**.kiryuuid.net",
  "**.uqni.net",
  // TMDB stills and posters
  "image.tmdb.org",
  // Article images from the news source
  "**.animenewsnetwork.com",
  // Live TV channel logos
  "i.imgur.com",
  "**.iptv-org.github.io",
];

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
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "media-src 'self' blob: https: http:",
  "font-src 'self' data:",
  "connect-src 'self' https: http:",
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
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
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
