"use client";

import { useParams } from "next/navigation";
import { useGetAnimeQuery } from "@/redux/api/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "@/components/skeleton";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const AnimeDetails = () => {
  const router = useParams();
  const {
    data: dataAnime,
    error: errorAnime,
    isLoading: loadingAnime,
  } = useGetAnimeQuery(router.slug);

  if (loadingAnime) {
    return <Skeleton />;
  }

  if (errorAnime) {
    return <>Error fetching data...</>;
  }

  return (
    <div className="container mx-auto mt-10">
      {dataAnime && (
        <Card>
          <CardHeader>
            <Image
              className="rounded-xl"
              width={400}
              height={400}
              src={dataAnime.data.poster}
              alt={dataAnime.data.title}
            />
          </CardHeader>
          <CardContent>
            <CardTitle>{dataAnime.data.title}</CardTitle>
            <p className="my-5">{dataAnime.data.synopsis}</p>
            <p>Rating: {dataAnime.data.rating}</p>
            <p>Type: {dataAnime.data.type}</p>
            <p>Status: {dataAnime.data.status}</p>
            <ul className="mt-5">
              {dataAnime.data.episode_lists.map(
                (episode: any, index: number) => (
                  <li
                    className="mt-2 rounded-xl bg-gray-100 px-10 py-2 text-base font-normal dark:bg-black"
                    key={episode.slug}
                  >
                    <Link href={`/anime/${router.slug}/episodes/${index + 1}`}>
                      <p>{episode.episode}</p>
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <p className="mb-2 mt-10 text-2xl font-semibold">Recommendations</p>
            <div className="flex gap-3">
              {dataAnime.data.recommendations.map((rec: any, index: number) => (
                <div key={rec.title}>
                  <Link href={`/anime/${rec.slug}`}>
                    <Image
                      className="rounded-xl"
                      width={400}
                      height={400}
                      src={rec.poster}
                      alt={rec.title}
                    />
                    <p>{rec.title}</p>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnimeDetails;
