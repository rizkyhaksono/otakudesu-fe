"use client";

import { useParams, notFound } from "next/navigation";
import { useGetAnimeQuery } from "@/redux/api/anime/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Skeleton from "@/components/layout/skeleton-card";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import AnimeRecommendations from "./_components/anime-recommendations";
import { saveEpisode } from "@/helpers/storage-episode";
import Typography from "@/components/ui/typography";

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

  if (dataAnime?.data === undefined) return notFound();

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
              width={1000}
              height={1000}
              src={dataAnime?.data?.poster}
              alt={dataAnime?.data?.title}
            />
            <div className="max-[766px]:my-5 min-[766px]:ml-10">
              <div className="font-normal">
                {dataAnime?.data?.synopsis || "Sinopsis belum ada."}
              </div>
              <Separator className="my-2" />
              <div>
                Rating:{" "}
                <Badge className="font-medium" variant={"secondary"}>
                  {dataAnime?.data?.rating}
                </Badge>
              </div>
              <div className="mt-1">
                Type:{" "}
                <Badge className="font-medium" variant={"secondary"}>
                  {dataAnime?.data?.type}
                </Badge>
              </div>
              <div className="mt-1">
                Status:{" "}
                <Badge className="font-medium" variant={"secondary"}>
                  {dataAnime?.data?.status}
                </Badge>
              </div>
              <div className="mt-1">
                Genres:{" "}
                <span className="font-semibold mt-1">
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
              </div>
            </div>
          </div>
          <div className="mt-5">
            {dataAnime?.data?.episode_lists.map(
              (episode: any, index: number) => (
                <Button
                  variant={"outline"}
                  className="mt-2 flex w-full justify-start whitespace-normal rounded-xl px-5 py-3 text-start text-base font-normal duration-300"
                  key={episode.slug}
                >
                  <Link
                    href={(dataAnime?.data?.type === "TV" || dataAnime?.data?.type === "BD") ? `/anime/${router.slug}/episodes/${episode.episode_number}` : `/anime/${router.slug}/episodes/${episode.slug}`}
                    onClick={() =>
                      saveEpisode({
                        title: dataAnime?.data?.title,
                        poster: dataAnime?.data?.poster,
                        router: router.slug,
                        episode: `/anime/${router.slug}/episodes/${episode.episode_number}`,
                      })
                    }
                  >
                    <Typography.P className="font-sans text-sm">{episode.episode}</Typography.P>
                  </Link>
                </Button>
              ),
            )}
          </div>
          <Separator className="my-5" />
          {dataAnime?.data?.recommendations && (
            <AnimeRecommendations
              recommendations={dataAnime?.data?.recommendations}
            />
          )}
        </CardContent>
      </Card>
    </div >
  );
}
