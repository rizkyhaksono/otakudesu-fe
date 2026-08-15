# Natee — Anime, Komik, Film & TV Indonesia

[![CI](https://github.com/rizkyhaksono/otakudesu-fe/actions/workflows/ci.yml/badge.svg)](https://github.com/rizkyhaksono/otakudesu-fe/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/runtime-bun%201.3-black)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/next.js-16-black)](https://nextjs.org)

Frontend for the [Otakudesu Community API](https://github.com/rizkyhaksono/otakudesu-be).
Nonton anime, baca komik, streaming film & serial, dan siaran TV Indonesia — dalam satu tempat.

## Features

- **Anime** — ongoing & completed listings, A–Z directory, detail pages, episode player with
  download tables, batch downloads, genres, weekly schedule, search
- **Komik** — a real reader: vertical-strip and paged modes, adjustable width, keyboard navigation,
  reading progress, chapter picker, and read-chapter markers
- **Film & serial** — TMDB metadata with a multi-provider player and a "Server 1 / 2 / 3" switcher;
  season and episode selection for series
- **TV Indonesia** — live HLS streaming with category filtering, quality selection, and automatic
  fallback to the backend proxy for channels without CORS
- **Cross-domain** — "Lanjutkan" history rail and bookmarks, stored locally, no account needed

## Architecture

Every content page is an **async Server Component** that fetches from the backend and renders real
HTML. There is no client-side data layer — Redux, RTK Query and `redux-persist` were removed
entirely. Interactive pieces (players, reader controls, search dialog, bookmarks) are small isolated
Client Components.

That single change is what makes the site indexable: previously all 17 content routes fetched on the
client, so crawlers received an empty skeleton. Now the anime title, synopsis, full episode list and
JSON-LD are all in the initial response.

```
src/app/…            routes — Server Components, ISR via `export const revalidate`
src/services/…       typed wrappers around the backend API
src/lib/api.ts       fetch client; `server-only`, so the API URL never reaches the browser
src/lib/storage.ts   localStorage history + bookmarks
src/components/…     ui/ (shadcn) · layout/ · media/ · comic/ · movie/ · tv/ · seo/
```

## Design

A squared-off editorial system: **zero border radius everywhere**, 1px hairline borders as the
primary structural device, no shadows, and elevation expressed through background tone. Display type
is Archivo, body is Inter, and all metadata (episode numbers, ratings, durations) is JetBrains Mono
with tabular figures so columns never shift.

Radius is controlled from one place — every `--radius-*` token in `globals.css` is `0`, so the
squared look holds no matter which utility a component uses.

## Quick start

```bash
bun install
cp .env.example .env      # point API_BASE_URL at your backend
bun run dev               # http://localhost:3001
```

The backend must be running for content to appear. See
[otakudesu-be](https://github.com/rizkyhaksono/otakudesu-be).

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `API_BASE_URL` | ✅ | Backend origin. Server-side only — no `NEXT_PUBLIC_` prefix, because it never reaches the browser. |
| `NEXT_PUBLIC_SITE_URL` | | Public origin used for canonical URLs, sitemap and OpenGraph tags. |

## Scripts

```bash
bun run dev         # dev server on :3001
bun run build       # production build (standalone output)
bun run start       # run the build
bun run lint        # eslint (flat config)
bun run typecheck   # tsc --noEmit
bun run format      # prettier
bun test            # unit tests
```

## SEO

`metadataBase`, title templates, canonical URLs, OpenGraph and Twitter cards, a generated
`sitemap.xml` covering the whole catalogue (~2,000 URLs), `robots.txt`, a web manifest, a generated
OG image, and JSON-LD for `WebSite` + `SearchAction`, `TVSeries`, `TVEpisode`, `Book`, `Chapter`,
`Movie`, `BroadcastService` and `BreadcrumbList`.

Missing pages return a real **HTTP 404**, not a soft 404 rendered with status 200.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: [SECURITY.md](SECURITY.md).

## Disclaimer

This is an index and aggregator. It hosts no media and stores no copyrighted content — only links
and metadata that are already publicly accessible. All content belongs to its respective owners.

## License

[MIT](LICENSE)
