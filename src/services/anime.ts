import { api, apiOr } from "@/lib/api";
import type {
  AnimeDetail,
  AnimeListGroup,
  AnimeMovie,
  Batch,
  CompleteAnime,
  Episode,
  EpisodeListItem,
  Genre,
  GenreAnime,
  OngoingAnime,
  Pagination,
  ScheduleDay,
  SearchResultAnime,
} from "@/types/api";

export const getAnimeHome = () =>
  apiOr<{ ongoing_anime: OngoingAnime[]; complete_anime: CompleteAnime[] }>(
    "/api/v1/anime/home",
    { ongoing_anime: [], complete_anime: [] },
    { revalidate: 300 },
  );

export const getOngoingAnime = (page: number) =>
  apiOr<{ paginationData: Pagination | false; ongoingAnimeData: OngoingAnime[] }>(
    `/api/v1/anime/ongoing/${page}`,
    { paginationData: false, ongoingAnimeData: [] },
    { revalidate: 300 },
  );

export const getCompleteAnime = (page: number) =>
  apiOr<{ paginationData: Pagination | false; completeAnimeData: CompleteAnime[] }>(
    `/api/v1/anime/complete/${page}`,
    { paginationData: false, completeAnimeData: [] },
    { revalidate: 300 },
  );

export const getAnimeList = () =>
  apiOr<AnimeListGroup[]>("/api/v1/anime/list", [], { revalidate: 86_400 });

export const getGenres = () => apiOr<Genre[]>("/api/v1/anime/genres", [], { revalidate: 86_400 });

export const getAnimeByGenre = (slug: string, page: number) =>
  api<{ anime: GenreAnime[]; pagination: Pagination | false }>(
    `/api/v1/anime/genres/${slug}?page=${page}`,
    { revalidate: 1800 },
  );

export const getSchedule = () =>
  apiOr<ScheduleDay[]>("/api/v1/anime/schedule", [], { revalidate: 3600 });

export const searchAnime = (keyword: string) =>
  apiOr<SearchResultAnime[]>(
    `/api/v1/anime/search/${encodeURIComponent(keyword)}`,
    [],
    { revalidate: 300 },
  );

export const getAnime = (slug: string) =>
  api<AnimeDetail>(`/api/v1/anime/detail/${slug}`, { revalidate: 1800 });

export const getAnimeEpisodes = (slug: string) =>
  api<EpisodeListItem[]>(`/api/v1/anime/detail/${slug}/episodes`, { revalidate: 1800 });

export const getEpisode = (slug: string, episode: number) =>
  api<Episode>(`/api/v1/anime/detail/${slug}/episodes/${episode}`, { revalidate: 600 });

export const getBatch = (slug: string) =>
  api<Batch>(`/api/v1/anime/batch/${slug}`, { revalidate: 3600 });

export const getAnimeMovie = (slug: string) =>
  api<AnimeMovie>(`/api/v1/anime/movie/${slug}`, { revalidate: 1800 });

/** Resolve one alternate server token into a playable iframe URL. */
export async function getEpisodeMirror(content: string) {
  return api<{ url: string }>(`/api/v1/anime/mirror?content=${encodeURIComponent(content)}`, {
    revalidate: 600,
  });
}
