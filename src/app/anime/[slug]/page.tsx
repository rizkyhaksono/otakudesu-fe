"use client";

import { useParams } from "next/navigation";
import { useGetAnimeQuery } from "@/redux/api/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/layout/skeleton-card";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useDynamicTitle } from "@/helpers/dynamic-title";
import AnimeRecommendations from "@/components/layout/anime-recommendations";
import { saveEpisode } from "@/helpers/storage-episode";
import { subtitle } from "@/components/layout/primitives";

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
              <p className="font-normal">
                {dataAnime?.data?.synopsis || "Sinopsis belum ada."}
              </p>
              <Separator className="my-2" />
              <p>
                Rating:{" "}
                <Badge className="font-medium" variant={"secondary"}>
                  {dataAnime?.data?.rating}
                </Badge>
              </p>
              <p className="mt-1">
                Type:{" "}
                <Badge className="font-medium" variant={"secondary"}>
                  {dataAnime?.data?.type}
                </Badge>
              </p>
              <p className="mt-1">
                Status:{" "}
                <Badge className="font-medium" variant={"secondary"}>
                  {dataAnime?.data?.status}
                </Badge>
              </p>
              <p className="mt-1">
                Genres:{" "}
                <span className="font-semibold">
                  {dataAnime?.data?.genres.map((genre: any) => (
                    <Link
                      key={genre.name}
                      href={`/genres/${genre.slug}?page=1`}
                      className="duration-300"
                    >
                      <Badge className="mr-1" variant={"secondary"}>
                        {genre.name}
                      </Badge>
                    </Link>
                  ))}
                </span>
              </p>
            </div>
          </div>
          <ul className="mt-5">
            {dataAnime?.data?.episode_lists.map(
              (episode: any, index: number) => (
                <Button
                  variant={"outline"}
                  className={subtitle({
                    className:
                      "mt-2 flex w-full justify-start rounded-xl px-5 py-3 text-base font-normal duration-300",
                  })}
                  key={episode.slug}
                >
                  <Link
                    href={`/anime/${router.slug}/episodes/${index + 1}`}
                    onClick={() =>
                      saveEpisode({
                        title: dataAnime?.data?.title,
                        poster: dataAnime?.data?.poster,
                        router: router.slug,
                        episode: `/anime/${router.slug}/episodes/${index + 1}`,
                      })
                    }
                  >
                    <p className="font-medium">{episode.episode}</p>
                  </Link>
                </Button>
              ),
            )}
          </ul>

          <Separator className="my-5" />

          {dataAnime?.data?.recommendations && (
            <AnimeRecommendations
              recommendations={dataAnime?.data?.recommendations}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
