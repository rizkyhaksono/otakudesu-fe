import { api } from "@/lib/api";
import type { AnimeQuote } from "@/types/api";

export const getRandomQuote = () => api<AnimeQuote>("/api/v1/anime/quotes", { revalidate: 0 });

export const getQuotesFor = (anime: string) =>
  api<AnimeQuote[]>(`/api/v1/anime/quotes?anime=${encodeURIComponent(anime)}`, { revalidate: 21_600 });
