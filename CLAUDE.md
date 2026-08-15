# CLAUDE.md

Guidance for AI agents working in this repository.

## Commands

```bash
bun run dev         # dev server on :3001 (needs the backend running)
bun run build       # production build (standalone)
bun run lint        # eslint flat config  (`next lint` was REMOVED in Next 16)
bun run typecheck   # tsc --noEmit
bun test tests      # unit tests
```

Package manager is **bun**; there is no `package-lock.json`.

Toolchain note: TypeScript is pinned to 5.9 and ESLint to 9, not the newest releases.
typescript-eslint does not support TS 7, and `eslint-plugin-react` (via `eslint-config-next`) still
calls `context.getFilename()`, removed in ESLint 10. Both were verified to break.

## Architecture

This is a **Server Component app**. There is no client-side data layer — Redux, RTK Query and
`redux-persist` were removed. Content pages are `async` functions that fetch and render HTML.

```
src/app/…            routes; ISR via `export const revalidate`
src/services/…       typed wrappers around the backend API
src/lib/api.ts       fetch client — `server-only`
src/lib/storage.ts   localStorage history + bookmarks
src/components/…     ui/ · layout/ · media/ · comic/ · movie/ · tv/ · history/ · seo/
```

### Rules that must survive edits

- **Default to Server Components.** `"use client"` only for browser APIs or interactive state
  (players, reader controls, dialogs, bookmarks). Never fetch data in a client component.
- **Never import `src/lib/api.ts` from a client component** — it is `server-only` and will throw.
  That guard is what keeps `API_BASE_URL` out of the browser bundle.
- **`generateMetadata` must use real API data**, never a prettified slug. Use `metaDescription()`
  from `src/lib/seo.ts`: upstream fields are often present but empty, and `??` does not catch `""`.
- **Missing content calls `notFound()` on the server** so the response is a real HTTP 404. The old
  code called it from client components, which produced soft 404s with status 200.
- **No `dangerouslySetInnerHTML` for upstream content.** The only permitted use is JSON-LD in
  `src/components/seo/json-ld.tsx`.
- **Subscribe to localStorage with `useSyncExternalStore`** (`src/hooks/use-storage.ts`), not
  `useEffect` + `setState` — React 19's lint rules reject the latter and the former is correct.

## Design system

Squared editorial style. **Every `--radius-*` token in `src/app/globals.css` is `0`**, plus a base
`border-radius: 0 !important` — so radius is controlled in exactly one place and no component can
reintroduce rounding. Structure comes from 1px borders and background tone; there are no shadows.

Fonts: Archivo (display), Inter (body), JetBrains Mono (all metadata, with tabular figures).
Utility classes `eyebrow`, `chip` and `grid-hairline` live in `globals.css`.

## Adding a page

Route → service function in `src/services/` → `export const revalidate` → `generateMetadata` →
`PageShell` with breadcrumbs → JSON-LD if a schema.org type fits → register in `src/app/sitemap.ts`.

## Disclaimer

Index/aggregator only; no media is hosted here.

