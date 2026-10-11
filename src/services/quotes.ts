import { api } from "@/lib/api";
import type { AnimeQuote } from "@/types/api";

// Quotes are decoration: an outage hides them instead of failing the page.
export const getRandomQuote = () =>
  api<AnimeQuote>("/api/v1/anime/quotes", { revalidate: 300 }).catch(() => null);

export const getQuotesFor = (anime: string) =>
  api<AnimeQuote[]>(`/api/v1/anime/quotes?anime=${encodeURIComponent(anime)}`, {
    revalidate: 21_600,
  }).catch(() => null);
