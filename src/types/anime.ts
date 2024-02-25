interface AnimeCardProps {
  anime: {
    title: string;
    poster: string;
    synopsis: string;
    rating: string;
    episode_lists: Array<{
      episode: string;
      slug: string;
      otakudesu_url: string;
    }>;
  };
}

export default AnimeCardProps;