export interface GenresAnimeProps {
  title: string;
  slug: string;
  poster: string;
  rating: string;
  episode_count: string;
  season: string;
  studio: string;
  last_release_date: string;
  otakudesu_url: string;
  synopsis: string;
  genres: GenreAnime[];
  pagination: Pagination;
}

interface GenreAnime {
  name: string;
  slug: string;
  otakudesu_url: string;
}

interface Pagination {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number;
  has_previous_page: boolean;
  previous_page: boolean;
}
