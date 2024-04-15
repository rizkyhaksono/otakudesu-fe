export interface OnGoingAnimeProps {
  title: string;
  slug: string;
  poster: string;
  current_episode?: string;
  release_day?: string;
  newest_release_date?: string;
  otakudesu_url?: string;
  rating?: string;
  last_release_date?: string;
  genres: AnimeGenres[];
}

interface AnimeGenres {
  name: string;
  slug: string;
  otakudesu_url: string;
}
