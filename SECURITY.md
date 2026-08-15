# Security Policy

## Reporting a vulnerability

**Do not open a public issue.** Report privately via
[GitHub Security Advisories](https://github.com/rizkyhaksono/otakudesu-fe/security/advisories/new).

You will get an acknowledgement within 72 hours.

## What is in place

| Area | Measure |
| --- | --- |
| **XSS** | No `dangerouslySetInnerHTML` for upstream content anywhere. The only use is JSON-LD, where the payload is `JSON.stringify`-ed with `<` escaped. Upstream text is additionally tag-stripped by the backend. |
| **CSP** | Static policy in `next.config.ts`: `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, and a `frame-src` allowlist limited to the known embed providers. |
| **Third-party players** | Every embed iframe is `sandbox`ed without `allow-top-navigation` or `allow-popups`, with `referrerPolicy="origin"`, so a player cannot navigate the page or open ad windows. |
| **Server secrets** | `API_BASE_URL` has no `NEXT_PUBLIC_` prefix and `src/lib/api.ts` is `server-only`, so the backend origin is never bundled into client JavaScript. |
| **Image proxy abuse** | `images.remotePatterns` is a strict host allowlist. |
| **Headers** | HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a `Permissions-Policy` that disables camera, microphone, geolocation and topics. |

### Accepted trade-offs

- **CSP uses `'unsafe-inline'` for scripts and styles rather than a nonce.** Nonces require dynamic
  rendering on every page, which disables ISR and CDN caching. Given the site is read-only with no
  authentication and no user-submitted content, the strict allowlist is the better balance.
- **Embed providers are third-party** and outside our control. They are sandboxed and configurable
  from the backend.
