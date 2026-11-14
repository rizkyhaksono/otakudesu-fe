import { api } from "@/lib/api";

export type AnimeTrailer = { youtubeId: string; matchedTitle: string };

// A trailer is an extra on the hero: an outage hides the button, never the page.
export const getTrailer = (title: string) =>
  api<AnimeTrailer>(`/api/v1/anime/trailer?title=${encodeURIComponent(title)}`, {
    revalidate: 21_600,
  }).catch(() => null);
