"use client";

import { useParams, notFound } from "next/navigation";
import { useGetAnimeQuery } from "@/redux/api/anime/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SkeletonAnimeDetail from "@/components/layout/skeleton-anime-detail";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import AnimeRecommendations from "./_components/anime-recommendations";
import { saveEpisode } from "@/helpers/storage-episode";
import Typography from "@/components/ui/typography";

export default function AnimeSlugPage() {
  const router = useParams();
  const slug = Array.isArray(router.slug) ? router.slug[0] : router.slug;
  const safeSlug = slug ?? "";

  const {
    data: dataAnime,
    error: errorAnime,
    isLoading: loadingAnime,
  } = useGetAnimeQuery(safeSlug, { skip: !slug });

  if (!slug) return notFound();

  if (loadingAnime) {
    return <SkeletonAnimeDetail />;
  }

  if (errorAnime) {
    return <>Error fetching data...</>;
  }

  if (dataAnime?.data === undefined) return notFound();

  return (
    <div className="container mx-auto mt-6 px-4 pb-12">
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl sm:text-2xl">{dataAnime?.data?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Hero section: image + info */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <Image
                className="h-72 w-full rounded-xl object-cover sm:h-80 md:h-96 md:w-60 lg:w-72"
                width={300}
                height={400}
                src={dataAnime?.data?.poster}
                alt={dataAnime?.data?.title}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-sm leading-relaxed text-muted-foreground">
                {dataAnime?.data?.synopsis || "Sinopsis belum ada."}
              </div>
              <Separator />
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Rating</span>
                  <Badge variant={"secondary"}>{dataAnime?.data?.rating}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant={"secondary"}>{dataAnime?.data?.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={"secondary"}>{dataAnime?.data?.status}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1 text-sm">
                <span className="text-muted-foreground">Genres:</span>
                {dataAnime?.data?.genres.map((genre: any) => (
                  <Link key={genre.name} href={`/genres/${genre.slug}?page=1`}>
                    <Badge
                      className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                      variant={"secondary"}
                    >
                      {genre.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Episode list */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Episodes</h3>
              <span className="text-xs text-muted-foreground">
                {dataAnime?.data?.episode_lists?.length ?? 0} episode
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {dataAnime?.data?.episode_lists.map((episode: any) => (
                <Button
                  key={episode.slug}
                  asChild
                  variant="outline"
                  className="h-auto w-full justify-start rounded-lg border-border/70 px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/10"
                >
                  <Link
                    href={
                      dataAnime?.data?.type === "TV" || dataAnime?.data?.type === "BD"
                        ? `/anime/${slug}/episodes/${episode.episode_number}`
                        : `/anime/${slug}/episodes/${episode.slug}`
                    }
                    onClick={() =>
                      saveEpisode({
                        title: dataAnime?.data?.title,
                        poster: dataAnime?.data?.poster,
                        router: slug,
                        episode:
                          dataAnime?.data?.type === "TV" || dataAnime?.data?.type === "BD"
                            ? `/anime/${slug}/episodes/${episode.episode_number}`
                            : `/anime/${slug}/episodes/${episode.slug}`,
                      })
                    }
                    className="flex items-start gap-2"
                  >
                    <span className="mt-0.5 min-w-8 rounded-md bg-primary/15 px-1.5 py-0.5 text-center text-[11px] font-semibold text-primary">
                      {episode.episode_number ?? "-"}
                    </span>
                    <Typography.P className="line-clamp-2 text-sm font-medium leading-5 text-foreground">
                      {episode.episode}
                    </Typography.P>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-6" />
          {dataAnime?.data?.recommendations && (
            <AnimeRecommendations recommendations={dataAnime?.data?.recommendations} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
