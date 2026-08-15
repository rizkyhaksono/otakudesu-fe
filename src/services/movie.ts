import { api, apiOr } from "@/lib/api";
import type {
  MovieDetail,
  MovieEpisode,
  MovieHome,
  MoviePage,
  MovieSources,
  MovieSummary,
} from "@/types/api";

export const getMovieHome = () =>
  apiOr<MovieHome>(
    "/api/v1/movie/home",
    { trending: [], popular_movies: [], popular_tv: [] },
    { revalidate: 3600 },
  );

export const getMovie = (id: number) =>
  api<MovieDetail>(`/api/v1/movie/${id}`, { revalidate: 3600 });

export const getSeries = (id: number) =>
  api<MovieDetail>(`/api/v1/movie/tv/${id}`, { revalidate: 3600 });

export const getSeason = (id: number, season: number) =>
  api<{ season_number: number; episodes: MovieEpisode[] }>(
    `/api/v1/movie/tv/${id}/season/${season}`,
    { revalidate: 3600 },
  );

export const searchMovies = (query: string, page = 1) =>
  apiOr<MoviePage<MovieSummary>>(
    `/api/v1/movie/search?q=${encodeURIComponent(query)}&page=${page}`,
    { page, total_pages: 0, results: [] },
    { revalidate: 300 },
  );

export const getMovieGenres = () =>
  apiOr<{ movie: { id: number; name: string }[]; tv: { id: number; name: string }[] }>(
    "/api/v1/movie/genres",
    { movie: [], tv: [] },
    { revalidate: 86_400 },
  );

export const discoverByGenre = (id: number, page = 1, type: "movie" | "tv" = "movie") =>
  apiOr<MoviePage<MovieSummary>>(
    `/api/v1/movie/genres/${id}?page=${page}&type=${type}`,
    { page, total_pages: 0, results: [] },
    { revalidate: 3600 },
  );

export const getMovieSources = (id: number) =>
  api<MovieSources>(`/api/v1/movie/${id}/sources`, { revalidate: 86_400 });

export const getSeriesSources = (id: number, season: number, episode: number) =>
  api<MovieSources>(
    `/api/v1/movie/tv/${id}/sources?season=${season}&episode=${episode}`,
    { revalidate: 86_400 },
  );

export type MovieCategory = "trending" | "popular" | "top-rated" | "tv" | "tv-top-rated";

/** Paginated category listing behind each home shelf's "see all". */
export async function listMovies(category: MovieCategory, page = 1) {
  const params = new URLSearchParams({ category });
  if (page > 1) params.set("page", String(page));

  return apiOr<MoviePage<MovieSummary>>(
    `/api/v1/movie/list?${params.toString()}`,
    { page: 1, total_pages: 0, results: [] },
    { revalidate: 3600 },
  );
}
