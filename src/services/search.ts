import { apiOr } from "@/lib/api";
import { FEATURES } from "@/lib/site";
import type { SearchResult } from "@/types/api";

const MOVIE_KINDS = new Set(["movie", "tv_series"]);

export const omniSearch = async (q: string): Promise<SearchResult> => {
  const result = await apiOr<SearchResult>(`/api/v1/search?q=${encodeURIComponent(q)}`, {
    query: q,
    total: 0,
    hits: [],
    counts: { anime: 0, comic: 0, movie: 0, tv_series: 0, radio: 0 },
  }, { revalidate: 0 });

  if (FEATURES.movie) return result;

  // The backend still searches TMDB; drop those hits so nothing links to the
  // disabled `/movie` routes.
  const hits = result.hits.filter((hit) => !MOVIE_KINDS.has(hit.kind));
  return {
    ...result,
    hits,
    total: hits.length,
    counts: { ...result.counts, movie: 0, tv_series: 0 },
  };
};
