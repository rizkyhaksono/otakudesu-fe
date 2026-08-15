import type { MetadataRoute } from "next";
import { getAnimeList, getGenres } from "@/services/anime";
import { getComicHome } from "@/services/comic";
import { getTvChannels } from "@/services/tv";
import { SITE } from "@/lib/site";

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
    { url: url("/movie"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: url("/tv"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // A failure in any one source must not take the whole sitemap down.
  const [groups, genres, comics, tv] = await Promise.all([
    getAnimeList().catch(() => []),
    getGenres().catch(() => []),
    getComicHome().catch(() => null),
    getTvChannels().catch(() => ({ channels: [], total: 0 })),
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

  // De-duplicate: the same comic can appear in several home listings.
  const seen = new Set<string>();
  return [...staticRoutes, ...animeRoutes, ...genreRoutes, ...comicRoutes, ...tvRoutes].filter(
    (entry) => {
      if (seen.has(entry.url)) return false;
      seen.add(entry.url);
      return true;
    },
  );
}
