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
export type NavLink = { href: string; label: string; description?: string };
export type NavGroup = { label: string; items: readonly NavLink[] };
export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

export const ANIME_LINKS: readonly NavLink[] = [
  { href: "/ongoing-anime/1", label: "Sedang tayang", description: "Episode terbaru tiap hari" },
  { href: "/completed-anime/1", label: "Selesai tayang", description: "Anime yang sudah tamat" },
  { href: "/schedules", label: "Jadwal rilis", description: "Tahu hari rilis tiap judul" },
  { href: "/genres", label: "Genre", description: "Jelajahi per kategori" },
  { href: "/anime-list", label: "Daftar A–Z", description: "Seluruh katalog" },
];

export const COMIC_LINKS: readonly NavLink[] = [
  { href: "/comic", label: "Update terbaru", description: "Chapter yang baru rilis" },
  { href: "/comic/browse", label: "Jelajahi katalog", description: "Ribuan judul, bisa difilter" },
  { href: "/comic/genres", label: "Genre", description: "Action, romance, isekai…" },
];

export const NAV: readonly NavEntry[] = [
  { label: "Anime", items: ANIME_LINKS },
  { label: "Komik", items: COMIC_LINKS },
  { href: "/movie", label: "Film" },
  { href: "/tv", label: "TV Live" },
];

/** Flattened form, used by the footer and the sitemap. */
export const NAV_FLAT: readonly NavLink[] = [
  { href: "/", label: "Beranda" },
  ...ANIME_LINKS,
  ...COMIC_LINKS,
  { href: "/movie", label: "Film" },
  { href: "/tv", label: "TV Live" },
  { href: "/bookmark", label: "Bookmark" },
];

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
