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
}

interface GenreAnime {
  name: string;
  slug: string;
  otakudesu_url: string;
}
