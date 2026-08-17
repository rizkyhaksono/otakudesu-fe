import { api } from "@/lib/api";
import type { AnimeThemeSet } from "@/types/api";

export const getAnimeThemes = (title: string) =>
  api<AnimeThemeSet>(`/api/v1/anime/themes?title=${encodeURIComponent(title)}`, {
    revalidate: 21_600,
  });
