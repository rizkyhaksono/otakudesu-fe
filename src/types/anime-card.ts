export type AnimeCardProps = {
  data: {
    title: string;
    poster: string;
    synopsis: string;
    episode_lists: {
      slug: string;
      episode: string;
    }[];
    rating: number;
  };
};
