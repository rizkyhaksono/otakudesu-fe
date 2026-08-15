# Contributing

## Setup

```bash
bun install
cp .env.example .env
bun run dev          # needs the backend running; see otakudesu-be
```

Before opening a PR:

```bash
bun run typecheck && bun run lint && bun test
```

## Ground rules

**Pages are Server Components by default.** Only add `"use client"` when a component genuinely needs
browser APIs or state — a player, the reader controls, a dialog. If you find yourself fetching data
in a client component, the data belongs in the page instead. This is what keeps the site indexable
and the bundle small.

**Never import `src/lib/api.ts` from a client component.** It is marked `server-only` and will throw.
Data flows down as props.

**Every page needs `generateMetadata` built from real data,** not from prettifying the slug. Use
`metaDescription()` from `src/lib/seo.ts` — upstream text fields are often present but empty, and
`??` does not catch `""`.

**Missing content must call `notFound()`** from the server so the response carries a real 404.

## Design system

- Radius is zero everywhere and controlled by tokens in `src/app/globals.css`. Do not add
  `rounded-*` classes expecting them to show.
- Use hairline borders and background tone for structure; no shadows.
- Metadata (numbers, durations, ratings) uses `font-mono` with `tabular-nums`.
- Interactive elements must have a visible `:focus-visible` outline and an accessible name.
- Respect `prefers-reduced-motion` — the base layer already does, do not override it.

## Adding a page

1. Create the route under `src/app/`.
2. Add a service function in `src/services/` rather than calling `api()` from the page directly.
3. Export `revalidate` matching the backend's caching window.
4. Add `generateMetadata`, breadcrumbs via `PageShell`, and JSON-LD where a schema.org type fits.
5. Register the route in `src/app/sitemap.ts` if it should be indexed.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat(comic): …`, `fix(tv): …`.
