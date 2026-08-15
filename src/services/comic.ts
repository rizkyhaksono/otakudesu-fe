import { api, apiOr } from "@/lib/api";
import type {
  ComicBrowse,
  ComicChapter,
  ComicDetail,
  ComicGenre,
  ComicHome,
} from "@/types/api";

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

/** Full catalogue: paginated, filterable by genre, searchable. */
export async function browseComics(options: {
  page?: number;
  genre?: string;
  q?: string;
} = {}) {
  const params = new URLSearchParams();
  if (options.page && options.page > 1) params.set("page", String(options.page));
  if (options.genre) params.set("genre", options.genre);
  if (options.q) params.set("q", options.q);

  const query = params.toString();
  return apiOr<ComicBrowse>(
    `/api/v1/comic/browse${query ? `?${query}` : ""}`,
    { pagination: { current_page: 1, last_page: 1, per_page: 24, total: 0 }, genres: [], comics: [] },
    { revalidate: options.q ? 300 : 1800 },
  );
}

export async function getComicGenres() {
  return apiOr<ComicGenre[]>("/api/v1/comic/genres", [], { revalidate: 86_400 });
}
