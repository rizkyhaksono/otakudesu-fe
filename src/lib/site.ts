export const SITE = {
  name: "Natee",
  shortName: "Natee",
  tagline: "Anime, komik, film & TV Indonesia",
  description:
    "Nonton anime sub Indo, baca komik dan manhwa, streaming film & serial, plus siaran TV Indonesia — semuanya gratis dalam satu tempat.",
  locale: "id_ID",
  lang: "id",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://otakudesu.natee.my.id").replace(/\/+$/, ""),
  twitter: "@rizkyhaksono",
  github: "https://github.com/rizkyhaksono/otakudesu-fe",
} as const;

/**
 * Navigation is grouped by domain rather than listed flat.
 *
 * Nine top-level links read as clutter and gave every page equal weight. The
 * four domains are the actual mental model; everything anime-specific lives one
 * level down. Dropdown children still render into the HTML, so crawlers keep the
 * full internal link graph.
 */
export type NavLink = {
  href: string;
  label: string;
  description?: string;
  /** Key into `dictionary.nav`, used to translate the visible label. */
  key?: string;
};
export type NavGroup = { label: string; key?: string; items: readonly NavLink[] };
export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

export const ANIME_LINKS: readonly NavLink[] = [
  { href: "/ongoing-anime/1", label: "Sedang tayang", key: "ongoing", description: "Episode terbaru tiap hari" },
  { href: "/completed-anime/1", label: "Selesai tayang", key: "completed", description: "Anime yang sudah tamat" },
  { href: "/schedules", label: "Jadwal rilis", key: "schedule", description: "Tahu hari rilis tiap judul" },
  { href: "/genres", label: "Genre", key: "genres", description: "Jelajahi per kategori" },
  { href: "/anime-list", label: "Daftar A–Z", key: "directory", description: "Seluruh katalog" },
];

export const COMIC_LINKS: readonly NavLink[] = [
  { href: "/comic", label: "Update terbaru", key: "latest", description: "Chapter yang baru rilis" },
  { href: "/comic/browse", label: "Jelajahi katalog", key: "browse", description: "Ribuan judul, bisa difilter" },
  { href: "/comic/genres", label: "Genre", key: "genres", description: "Action, romance, isekai…" },
];

export const NAV: readonly NavEntry[] = [
  { label: "Anime", key: "anime", items: ANIME_LINKS },
  { label: "Komik", key: "comic", items: COMIC_LINKS },
  { href: "/movie", label: "Film", key: "movie" },
  { href: "/tv", label: "TV Live", key: "tv" },
];

/** Flattened form, used by the footer and the sitemap. */
export const NAV_FLAT: readonly NavLink[] = [
  { href: "/", label: "Beranda" },
  ...ANIME_LINKS,
  ...COMIC_LINKS,
  { href: "/movie", label: "Film", key: "movie" },
  { href: "/tv", label: "TV Live", key: "tv" },
  { href: "/bookmark", label: "Bookmark", key: "bookmark" },
];

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * `hreflang` map for a path.
 *
 * The default locale is served unprefixed, so its alternate is the bare path —
 * that keeps every already-indexed URL as the canonical one while telling
 * search engines the other two are translations, not duplicates.
 */
export function localeAlternates(path = "/"): Record<string, string> {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return {
    id: absoluteUrl(clean),
    en: absoluteUrl(clean === "/" ? "/en" : `/en${clean}`),
    ja: absoluteUrl(clean === "/" ? "/ja" : `/ja${clean}`),
    "x-default": absoluteUrl(clean),
  };
}
