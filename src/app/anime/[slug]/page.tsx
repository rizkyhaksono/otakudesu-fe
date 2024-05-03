"use client";

import { useParams } from "next/navigation";
import { useGetAnimeQuery } from "@/redux/api/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "@/components/layout/skeleton-card";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useDynamicTitle } from "@/helpers/dynamic-title";
import AnimeRecommendations from "@/components/layout/anime-recommendations";

export default function AnimeSlugPage() {
  const router = useParams();
  const {
    data: dataAnime,
    error: errorAnime,
    isLoading: loadingAnime,
  } = useGetAnimeQuery(router.slug);

  useDynamicTitle(loadingAnime, dataAnime?.data?.title);

  if (loadingAnime) {
    return <Skeleton />;
  }

  if (errorAnime) {
    return <>Error fetching data...</>;
  }

  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{dataAnime?.data?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-[640px]:grid-cols-1 md:flex lg:flex xl:flex">
            <Image
              className="h-96 w-96 rounded-xl object-cover"
              width={400}
              height={400}
              src={dataAnime?.data?.poster}
              alt={dataAnime?.data?.title}
            />
            <div className="max-[766px]:my-5 min-[766px]:ml-10">
              <p className="font-normal">{dataAnime?.data?.synopsis}</p>
              <p className="mt-5">
                Rating:{" "}
                <span className="font-medium">{dataAnime?.data?.rating}</span>
              </p>
              <p>
                Type:{" "}
                <span className="font-medium">{dataAnime?.data?.type}</span>
              </p>
              <p>
                Status:{" "}
                <span className="font-medium">{dataAnime?.data?.status}</span>
              </p>
              <p>
                Genres:{" "}
                <span className="font-semibold">
                  {dataAnime?.data?.genres.map((genre: any, index: number) => (
                    <Link
                      key={genre.name}
                      href={`/genres/${genre.slug}?page=1`}
                      className="duration-300 hover:text-gray-400"
                    >
                      {genre.name}
                      {index < dataAnime?.data?.genres.length - 1 && ", "}
                    </Link>
                  ))}
                </span>
              </p>
            </div>
          </div>
          <ul className="mt-5">
            {dataAnime?.data?.episode_lists.map(
              (episode: any, index: number) => (
                <li
                  className="mt-2 w-full rounded-xl bg-gray-100 px-5 py-3 text-base font-normal duration-300 hover:bg-gray-200 dark:bg-[#1f2022] hover:dark:bg-white/10"
                  key={episode.slug}
                >
                  <Link href={`/anime/${router.slug}/episodes/${index + 1}`}>
                    <p className="font-medium">{episode.episode}</p>
                  </Link>
                </li>
              ),
            )}
          </ul>

          {dataAnime?.data?.recommendations && (
            <div className="mt-10">
              <AnimeRecommendations
                recommendations={dataAnime?.data?.recommendations}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
