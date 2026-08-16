/**
 * Mirror of the backend response shapes.
 *
 * The backend is a separate repository, so these types cannot be imported. The
 * contract is guarded by the backend's endpoint tests plus `bun test` here.
 */

// ── Anime ─────────────────────────────────────────────────────────────────────

export type Genre = {
  name?: string;
  slug?: string;
  otakudesu_url?: string;
};

export type OngoingAnime = {
  title?: string;
  slug?: string;
  poster?: string;
  current_episode?: string;
  release_day?: string;
  newest_release_date?: string;
  otakudesu_url?: string;
};

export type CompleteAnime = {
  title?: string;
  slug?: string;
  poster?: string;
  episode_count?: string;
  rating?: string;
  last_release_date?: string;
  otakudesu_url?: string;
};

export type EpisodeListItem = {
  episode?: string;
  episode_number?: number;
  slug?: string;
  otakudesu_url?: string;
};

export type DownloadGroup = {
  resolution?: string;
  file_size?: string;
  urls: { provider?: string; url?: string }[];
};

export type AnimeDetail = {
  title?: string;
  slug?: string;
  japanese_title?: string;
  poster?: string;
  rating?: string;
  produser?: string;
  type?: string;
  status?: string;
  episode_count?: string;
  duration?: string;
  release_date?: string;
  studio?: string;
  genres: Genre[];
  synopsis?: string;
  batch: { slug?: string; otakudesu_url?: string; uploaded_at?: string } | null;
  episode_lists: EpisodeListItem[];
  recommendations: { title?: string; slug?: string; poster?: string; otakudesu_url?: string }[];
};

export type EpisodeRef = { slug?: string; otakudesu_url?: string } | null;

export type EpisodeMirror = {
  provider: string;
  quality: string | null;
  /** Opaque token handed back to the mirror-resolve endpoint. */
  content: string;
};

export type Episode = {
  episode: string;
  anime: { slug?: string; otakudesu_url?: string };
  has_next_episode: boolean;
  next_episode: EpisodeRef;
  has_previous_episode: boolean;
  previous_episode: EpisodeRef;
  stream_url?: string;
  /** Alternate servers; resolve each via /api/v1/anime/mirror. */
  mirrors?: EpisodeMirror[];
  download_urls: { mp4: DownloadGroup[]; mkv: DownloadGroup[] };
};

export type AnimeMovie = {
  title?: string;
  iframe_src?: string;
  download_urls: { mp4: DownloadGroup[]; mkv: DownloadGroup[] };
};

export type Batch = { batch?: string; download_urls: DownloadGroup[] };

export type Pagination = {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number | null;
  has_previous_page: boolean;
  previous_page: number | null;
};

export type SearchResultAnime = {
  title?: string;
  slug?: string;
  poster?: string;
  status?: string;
  rating?: string;
  genres: Genre[];
  url?: string;
};

export type AnimeListGroup = {
  letter: string;
  anime_list: { title?: string; slug?: string; otakudesu_url?: string }[];
};

export type ScheduleDay = {
  day: string;
  anime_list: { anime_name: string; url: string; slug: string }[];
};

export type GenreAnime = {
  title?: string;
  slug?: string;
  poster?: string;
  rating?: string;
  episode_count: string | null;
  season?: string;
  studio?: string;
  genres: Genre[];
  synopsis?: string;
  otakudesu_url?: string;
};

// ── Comic ─────────────────────────────────────────────────────────────────────

export type ComicGenre = { name: string; slug: string; icon: string | null };

export type ComicChapterRef = {
  title: string | null;
  slug: string | null;
  chapter_number: number | null;
  released_at: string | null;
};

export type ComicSummary = {
  title: string | null;
  slug: string | null;
  poster: string | null;
  type: string | null;
  status: string | null;
  rating: number | null;
  release_year: number | null;
  views_count: number | null;
  synopsis: string | null;
  genres: ComicGenre[];
  latest_chapter: ComicChapterRef | null;
};

export type ComicHome = {
  popular_manga: ComicSummary[];
  trending_manga: ComicSummary[];
  latest_manga: ComicSummary[];
  popular_novels: ComicSummary[];
  latest_novels: ComicSummary[];
};

export type ComicDetail = ComicSummary & {
  author: string | null;
  artist: string | null;
  rank: number | null;
  total_raters: number | null;
  chapters: ComicChapterRef[];
  first_chapter: ComicChapterRef | null;
  related: ComicSummary[];
};

export type ComicChapter = {
  comic: { title: string | null; slug: string | null; poster: string | null };
  title: string | null;
  slug: string | null;
  chapter_number: number | null;
  released_at: string | null;
  images: string[];
  prev: ComicChapterRef | null;
  next: ComicChapterRef | null;
  chapters: ComicChapterRef[];
};

// ── Movie ─────────────────────────────────────────────────────────────────────

export type MediaType = "movie" | "tv";

export type MovieSummary = {
  id: number;
  media_type: MediaType;
  title: string | null;
  original_title: string | null;
  poster: string | null;
  backdrop: string | null;
  overview: string | null;
  release_date: string | null;
  release_year: number | null;
  rating: number | null;
  vote_count: number | null;
  genre_ids: number[];
};

export type MovieSeasonRef = {
  season_number: number;
  name: string | null;
  episode_count: number | null;
  air_date: string | null;
  poster: string | null;
};

export type MovieEpisode = {
  episode_number: number;
  name: string | null;
  overview: string | null;
  air_date: string | null;
  still: string | null;
  runtime: number | null;
};

export type MovieDetail = MovieSummary & {
  tagline: string | null;
  status: string | null;
  runtime: number | null;
  genres: { id: number; name: string }[];
  countries: string[];
  director: string | null;
  cast: { name: string; character: string | null; profile: string | null }[];
  trailer: string | null;
  homepage: string | null;
  imdb_id: string | null;
  seasons: MovieSeasonRef[];
};

export type MovieHome = {
  trending: MovieSummary[];
  popular_movies: MovieSummary[];
  popular_tv: MovieSummary[];
};

export type EmbedSource = { provider: string; name: string; url: string };

export type MovieSources = {
  media_type: MediaType;
  id: number;
  season?: number;
  episode?: number;
  sources: EmbedSource[];
};

export type MoviePage<T> = { page: number; total_pages: number; results: T[] };

// ── Live TV ───────────────────────────────────────────────────────────────────

export type TvChannel = {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  owners: string[];
  country: string;
  categories: string[];
  launched: string | null;
  website: string | null;
  logo: string | null;
  streams: {
    quality: string | null;
    title: string | null;
    url: string | null;
    proxy_url: string;
  }[];
};

export type TvCategory = { slug: string; count: number };

export type ComicPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ComicBrowse = {
  pagination: ComicPagination;
  genres: ComicGenre[];
  comics: ComicSummary[];
};

// ── Radio ─────────────────────────────────────────────────────────────────────

export type RadioStation = {
  id: string;
  name: string;
  stream: string;
  favicon: string | null;
  tags: string[];
  codec: string | null;
  bitrate: number | null;
  popularity: number;
  homepage: string | null;
  state: string | null;
  language: string | null;
  /** Only set when the stream is HTTPS; otherwise the browser would block it. */
  direct: string | null;
  proxy_url: string;
};

export type RadioTag = { slug: string; count: number };

// ── News ──────────────────────────────────────────────────────────────────────

export type NewsItem = {
  id: string;
  title: string;
  /** Canonical URL at the source, shown as attribution. */
  link: string;
  summary: string | null;
  published_at: string | null;
  category: string | null;
};

/** Typed blocks, so article content never has to be injected as HTML. */
export type NewsBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string | null };

export type NewsArticle = NewsItem & {
  intro: string | null;
  image: string | null;
  blocks: NewsBlock[];
  source: { name: string; url: string };
};

// ── Cross-domain search ──────────────────────────────────────────────────────

export type SearchHit = {
  kind: "anime" | "comic" | "movie" | "tv_series" | "radio";
  title: string;
  href: string;
  poster: string | null;
  meta: string | null;
};

export type SearchResult = {
  query: string;
  total: number;
  hits: SearchHit[];
  counts: Record<SearchHit["kind"], number>;
};

// ── AnimeChan quotes ──────────────────────────────────────────────────────────

export type AnimeQuote = {
  content: string;
  anime: string;
  character: string;
};

// ── trace.moe scene search ─────────────────────────────────────────────────────

export type SceneMatch = {
  similarity: number;
  anilistId: number | null;
  title: string;
  titleNative: string | null;
  episode: string | null;
  from: number;
  to: number;
  preview: string | null;
  image: string | null;
};

export type SceneSearchResult = {
  matches: SceneMatch[];
  quotaRemaining: number | null;
};
