import { api } from "@/lib/api";
import type { AnimeThemeSet } from "@/types/api";

// Optional extra on anime pages: an outage hides the playlist instead of failing the page.
export const getAnimeThemes = (title: string) =>
  api<AnimeThemeSet>(`/api/v1/anime/themes?title=${encodeURIComponent(title)}`, {
    revalidate: 21_600,
  }).catch(() => null);
