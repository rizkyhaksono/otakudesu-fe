# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server (default port 3001 per README; `next dev` itself defaults to 3000 unless overridden)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — `next lint` using the `next/core-web-vitals` + `next/typescript` config

There is no test runner configured.

## Required environment

Three upstream APIs are wired through RTK Query base configs and must be set before `npm run dev` will work end-to-end (see [.env.example](.env.example) and [src/redux/axios-base-query.js](src/redux/axios-base-query.js)):

- `NEXT_PUBLIC_BASE_ANIME_API_URL` — anime data (Otakudesu backend)
- `NEXT_PUBLIC_BASE_COMIC_API_URL` — comic data
- `NEXT_PUBLIC_BASE_MOVIE_API_URL` — movie data

A fourth base, `baseMovieBoxApi`, is hard-coded to `https://api.sansekai.my.id/api/moviebox` in the same file.

Remote image hostnames are allow-listed in [next.config.mjs](next.config.mjs) — when adding a new upstream that serves posters, that file must be updated or `next/image` will reject the URL at runtime.

## Architecture

This is a Next.js 16 App Router frontend (TypeScript, Tailwind, shadcn/ui "new-york" style, `@/*` → `./src/*`) that consumes three independent backend APIs and stitches them into a single UI.

### Three-domain split via App Router route groups

[src/app/](src/app/) is divided into three route groups, each owning one domain:

- `(anime)` — home (`page.tsx`), `anime/[slug]`, `anime/[slug]/episodes/...`, `completed-anime`, `ongoing-anime`, `genres`, `schedules`
- `(comic)` — `comic/[slug]`, `comic/chapter/...`
- `(movie)` — `movie/detail/...`, `movie/genre/...`, `movie/search/...`

Each group has its own `_components/` folder for route-local UI (`hero-carousel`, `home-layout`, cards, etc.) — these are intentionally not in the global [src/components/](src/components/) tree because they are coupled to a specific group's data shape. Global, reusable layout chrome lives in [src/components/layout/](src/components/layout/) and the shadcn primitives in [src/components/ui/](src/components/ui/).

### Data layer: four parallel RTK Query slices

Data fetching is centralized in Redux Toolkit Query, not in `fetch` calls inside components. The pattern, defined in [src/redux/axios-base-query.js](src/redux/axios-base-query.js):

1. Four `createApi` instances are declared up front — `baseAnimeApi`, `baseComicApi`, `baseMovieApi`, `baseMovieBoxApi` — each with its own `reducerPath` and `baseUrl`. They start with no endpoints.
2. Feature files under [src/redux/api/{anime,comic,movie}/](src/redux/api/) call `baseXxxApi.enhanceEndpoints({}).injectEndpoints(...)` to attach endpoints, then re-export the generated `useXxxQuery` hooks (e.g. [anime-home-api.ts](src/redux/api/anime/anime-home-api.ts), [anime-api.ts](src/redux/api/anime/anime-api.ts)).
3. [root-reducer.js](src/redux/root-reducer.js) combines all four reducers; [store.js](src/redux/store.js) wires all four `.middleware`s into `configureStore` and wraps the root in `redux-persist` (`whitelist: []` — nothing is actually persisted to localStorage by redux-persist; cache is in-memory only). `serializableCheck` and `immutableCheck` are disabled.

When adding a new endpoint, pick the correct base API for its domain and inject into it — do **not** add a fifth `createApi` unless a genuinely new upstream is being introduced. When adding a new domain, register the new reducer + middleware in both `root-reducer.js` and `store.js`.

The Redux files are intentionally JavaScript while the rest of the app is TypeScript (`allowJs: true` in [tsconfig.json](tsconfig.json)).

### Provider stack

[src/app/layout.tsx](src/app/layout.tsx) is server-side and only sets fonts + metadata. All client-side providers live in [src/app/provider.tsx](src/app/provider.tsx) (`"use client"`): Redux `Provider` → `next-themes` `ThemeProvider` (system default, class strategy) → `sonner` `Toaster` + `@vercel/analytics`. New global client context belongs here.

### Local persistence

`redux-persist` is configured but persists nothing. The "last watched" feature instead uses `localStorage` directly via [src/helpers/storage-episode.ts](src/helpers/storage-episode.ts), which keeps the most recent 24 episodes (`MAX_WATCHED_ITEMS`) keyed by `router`. All access is SSR-guarded with `typeof window === "undefined"` checks — preserve those guards when editing.

## Conventions

- Path alias: import from `@/...` (maps to `src/...`).
- shadcn/ui is configured in [components.json](components.json) — style `new-york`, RSC enabled, base color `gray`. New shadcn components land in [src/components/ui/](src/components/ui/).
- ESLint extends `next/core-web-vitals` + `next/typescript`; notable rules in [.eslintrc.json](.eslintrc.json): `no-console` warns (allows `warn`/`error`), unused vars prefixed with `_` are ignored, `no-explicit-any` is a warning not an error.
- Prettier ([.prettierrc](.prettierrc)): 100-col, 2-space, double quotes, `prettier-plugin-tailwindcss` sorts class names — run formatting before committing class-heavy JSX.
