import { apiOr } from "@/lib/api";
import type { SearchResult } from "@/types/api";

export const omniSearch = (q: string) =>
  apiOr<SearchResult>(`/api/v1/search?q=${encodeURIComponent(q)}`, {
    query: q,
    total: 0,
    hits: [],
    counts: { anime: 0, comic: 0, movie: 0, tv_series: 0, radio: 0 },
  }, { revalidate: 0 });
