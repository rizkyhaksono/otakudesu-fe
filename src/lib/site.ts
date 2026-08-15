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

export const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing-anime/1", label: "Ongoing" },
  { href: "/completed-anime/1", label: "Selesai" },
  { href: "/anime-list", label: "Daftar A–Z" },
  { href: "/genres", label: "Genre" },
  { href: "/schedules", label: "Jadwal" },
  { href: "/comic", label: "Komik" },
  { href: "/movie", label: "Film" },
  { href: "/tv", label: "TV Live" },
] as const;

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
