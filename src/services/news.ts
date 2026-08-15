import { api, apiOr } from "@/lib/api";
import type { NewsArticle, NewsItem } from "@/types/api";

export const getNews = (params: { q?: string; limit?: number } = {}) => {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();

  return apiOr<NewsItem[]>(`/api/v1/news${query ? `?${query}` : ""}`, [], { revalidate: 1800 });
};

export const getNewsArticle = (id: string) =>
  api<NewsArticle>(`/api/v1/news/${id}`, { revalidate: 86_400 });
