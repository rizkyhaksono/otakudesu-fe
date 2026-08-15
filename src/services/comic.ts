import { api, apiOr } from "@/lib/api";
import type { ComicChapter, ComicDetail, ComicHome } from "@/types/api";

export const getComicHome = () =>
  apiOr<ComicHome>(
    "/api/v1/comic/home",
    {
      popular_manga: [],
      trending_manga: [],
      latest_manga: [],
      popular_novels: [],
      latest_novels: [],
    },
    { revalidate: 300 },
  );

export const getComic = (slug: string) =>
  api<ComicDetail>(`/api/v1/comic/${slug}`, { revalidate: 1800 });

export const getComicChapter = (slug: string, chapter: number) =>
  api<ComicChapter>(`/api/v1/comic/${slug}/chapter/${chapter}`, { revalidate: 3600 });
