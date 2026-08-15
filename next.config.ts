import type { NextConfig } from "next";

/**
 * Only the hosts that actually serve images we render. `next/image` treats this
 * as an allowlist, so it doubles as protection against being used as an open
 * image proxy.
 */
const imageHosts = [
  "otakudesu.blog",
  "otakudesu.best",
  "otakudesu.cloud",
  "img.komiku.org",
  "thumbnail.komiku.org",
  "image.tmdb.org",
  "i.imgur.com",
];

const embedHosts = ["https://www.2embed.cc", "https://player.videasy.net", "https://vidsrc.to"];

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
  `frame-src 'self' ${embedHosts.join(" ")} https://disqus.com`,
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
      // Legacy query-string pagination -> path segments, which index far better.
      { source: "/anime", destination: "/search", permanent: true },
      { source: "/comic/chapter/:slug", destination: "/comic", permanent: false },
      { source: "/movie/detail/:id", destination: "/movie/:id", permanent: true },
      { source: "/movie/genre", destination: "/movie", permanent: true },
    ];
  },
};

export default nextConfig;
