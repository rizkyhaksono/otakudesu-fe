"use client";

import { useParams } from "next/navigation";
import { useGetAnimeQuery } from "@/redux/api/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "@/components/layout/skeleton-card";
import Image from "next/image";
import React from "react";
import Link from "next/link";

export default function AnimeSlugPage() {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{dataAnime?.data?.title}</CardTitle>
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

          <p className="mb-2 mt-10 text-2xl font-semibold">Recommendations</p>
          <div className="grid gap-3 max-[766px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {dataAnime?.data?.recommendations.map((rec: any) => (
              <Card
                className="cursor-pointer object-cover transition duration-300 hover:scale-105"
                key={rec.slug}
              >
                <Link href={`/anime/${rec.slug}`}>
                  <Image
                    className="h-auto w-96 rounded-sm object-cover"
                    width={400}
                    height={400}
                    src={rec.poster}
                    alt={rec.title}
                  />
                  <CardContent>
                    <p className="text-md mt-5 text-center font-semibold">
                      {rec.title}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
