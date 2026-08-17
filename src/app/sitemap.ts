import type { MetadataRoute } from "next";
import { getAnimeList, getGenres } from "@/services/anime";
import { getComicHome } from "@/services/comic";
import { getTvChannels } from "@/services/tv";
import { getRadioStations } from "@/services/radio";
import { getNews } from "@/services/news";
import { SITE } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/dictionaries";

/*
 * One hour, not a day: if the build ran while the API was unreachable the
 * sitemap would contain only static routes, and this bounds how long that
 * degraded version is served.
 */
export const revalidate = 3600;

const url = (path: string) => `${SITE.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: url("/ongoing-anime/1"), lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: url("/completed-anime/1"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: url("/anime-list"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: url("/genres"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/schedules"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: url("/comic"), lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: url("/comic/browse"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: url("/comic/genres"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/comic/novels"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    {
      url: url("/movie/browse?category=trending"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: url("/movie/browse?category=popular"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: url("/movie/browse?category=tv"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    { url: url("/movie"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: url("/tv"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/radio"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/berita"), lastModified: now, changeFrequency: "hourly", priority: 0.7 },
    { url: url("/cari-screenshot"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: url("/musik"), lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];

  // A failure in any one source must not take the whole sitemap down.
  const [groups, genres, comics, tv, radio, news] = await Promise.all([
    getAnimeList().catch(() => []),
    getGenres().catch(() => []),
    getComicHome().catch(() => null),
    getTvChannels().catch(() => ({ channels: [], total: 0 })),
    getRadioStations().catch(() => ({ stations: [], total: 0 })),
    getNews().catch(() => []),
  ]);

  const animeRoutes: MetadataRoute.Sitemap = groups
    .flatMap((group) => group.anime_list)
    .filter((anime) => Boolean(anime.slug))
    .map((anime) => ({
      url: url(`/anime/${anime.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const genreRoutes: MetadataRoute.Sitemap = genres
    .filter((genre) => Boolean(genre.slug))
    .map((genre) => ({
      url: url(`/genres/${genre.slug}/page/1`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  const comicRoutes: MetadataRoute.Sitemap = [
    ...(comics?.latest_manga ?? []),
    ...(comics?.popular_manga ?? []),
    ...(comics?.trending_manga ?? []),
  ]
    .filter((comic) => Boolean(comic.slug))
    .map((comic) => ({
      url: url(`/comic/${comic.slug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  const tvRoutes: MetadataRoute.Sitemap = tv.channels.map((channel) => ({
    url: url(`/tv/${channel.id}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const radioRoutes: MetadataRoute.Sitemap = radio.stations.map((station) => ({
    url: url(`/radio/${station.id}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: url(`/berita/${item.id}`),
    lastModified: item.published_at ? new Date(item.published_at) : now,
    changeFrequency: "never" as const,
    priority: 0.5,
  }));

  // De-duplicate: the same comic can appear in several home listings.
  const seen = new Set<string>();
  const base = [
    ...staticRoutes,
    ...animeRoutes,
    ...genreRoutes,
    ...comicRoutes,
    ...tvRoutes,
    ...radioRoutes,
    ...newsRoutes,
  ].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });

  /*
   * Only the entry points are emitted per-locale.
   *
   * The catalogue itself is Indonesian, so listing ~2,000 detail pages three
   * times would triple the sitemap to advertise pages whose content is
   * identical apart from the chrome. The section pages are where a non-
   * Indonesian visitor actually lands, and `hreflang` on every page handles the
   * rest.
   */
  const translated = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).flatMap((locale) =>
    staticRoutes.map((entry) => ({
      ...entry,
      url: entry.url.replace(SITE.url, `${SITE.url}/${locale}`),
      priority: (entry.priority ?? 0.5) * 0.8,
    })),
  );

  return [...base, ...translated];
}
