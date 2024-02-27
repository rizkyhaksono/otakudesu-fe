"use client";

import { useParams } from "next/navigation";
import { useGetEpisodeQuery } from "@/redux/api/episode-api";
import Skeleton from "@/components/skeleton";

export default function AnimeEpisode() {
  const router = useParams<{ slug: string; episodes: string }>();
  const {
    data: dataEpisode,
    isError: errorEpisode,
    isLoading: loadingEpisode,
  } = useGetEpisodeQuery({ slug: router.slug, episode: router.episodes });

  if (loadingEpisode) {
    return <Skeleton />;
  }

  if (errorEpisode) {
    return <>Error fetching data...</>;
  }

  return (
    <>
      {dataEpisode && dataEpisode.data && (
        <div className="container mx-auto">
          <div className="mb-5 mt-10 text-xl font-semibold">
            {dataEpisode.data.episode}
          </div>
          <iframe src={dataEpisode.data.stream_url} />
        </div>
      )}
    </>
  );
}
