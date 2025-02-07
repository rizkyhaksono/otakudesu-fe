"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetEpisodeQuery } from "@/redux/api/anime/anime-episode-api";
import { useGetAnimeQuery } from "@/redux/api/anime/anime-api";
import { useGetMovieQuery } from "@/redux/api/anime/anime-movie-api";
import Skeleton from "@/components/layout/skeleton-card";
import { updateEpisode } from "@/helpers/storage-episode";
import { useState } from "react";
import DisqusComments from "./components/disqus";
import TVSeries from "./components/tv-series";
import Movie from "./components/movie";

export default function AnimeEpisodesPage() {
  const link = useRouter();

  const router = useParams<{ slug: string; episodes?: string }>();
  const episodeNum = router.episodes ? Number(router.episodes) : null;
  const [provider, setProvider] = useState<string>("");

  const isMovie = isNaN(Number(router.episodes));

  const movieQuery = useGetMovieQuery({ slug: router.slug });
  const episodeQuery = useGetEpisodeQuery({ slug: router.slug, episode: router.episodes });

  const dataEpisode = isMovie ? movieQuery.data : episodeQuery.data;
  const errorEpisode = isMovie ? movieQuery.isError : episodeQuery.isError;
  const loadingEpisode = isMovie ? movieQuery.isLoading : episodeQuery.isLoading;

  const {
    data: dataAnime,
    error: errorAnime,
    isLoading: loadingAnime
  } = useGetAnimeQuery(router.slug);

  if (loadingEpisode || loadingAnime) return <Skeleton />;
  if (errorEpisode || errorAnime) return <>Error fetching data...</>;

  const handleAnimeEpisode = (episode: number) => {
    link.push(`/anime/${router.slug}/episodes/${episode}`);
  };

  return (
    <div className="container mx-auto mt-10">
      {isMovie ? (
        <Movie
          links={movieQuery?.data?.data?.downloadLinks}
          defaultLink={movieQuery?.data?.data?.iframeSrc}
          title={dataAnime?.data?.title}
        />
      ) : (
        <TVSeries
          dataAnime={dataAnime}
          dataEpisode={dataEpisode}
          episodeNum={episodeNum}
          handleAnimeEpisode={handleAnimeEpisode}
          provider={provider}
          router={link}
          setProvider={setProvider}
          updateEpisode={updateEpisode}
        />
      )}

      {/* Disable for a while, because it's not catch on eye lol */}
      {/* <DisqusComments
        post={{
          slug: router.slug,
          episodes: router.episodes,
          title: dataEpisode?.data?.episode,
        }}
      /> */}
    </div>
  );
}
