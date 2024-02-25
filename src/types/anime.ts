interface AnimeCardProps {
  anime: {
    title: string;
    japanese_title: string;
    producer: string;
    type: string;
    status: string;
    episode_count: string;
    duration: string;
    release_date: string;
    studio: string;
    poster: string;
    synopsis: string;
    rating: string;
    genres: Array<{
      name: string;
      slug: string;
      otakudesu_url: string;
    }>;
    episode_lists: Array<{
      episode: string;
      slug: string;
      otakudesu_url: string;
    }>;
    recommendation: Array<{
      title: string;
      slug: string;
      poster: string;
      otakudesu_url: string;
    }>;
  };
}

export default AnimeCardProps;