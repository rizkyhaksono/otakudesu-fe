"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetEpisodeQuery } from "@/redux/api/episode-api";
import { useGetAnimeQuery } from "@/redux/api/anime-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Skeleton from "@/components/layout/skeleton-card";
import Link from "next/link";
import { useDynamicTitle } from "@/helpers/dynamic-title";
import { title, subtitle } from "@/components/layout/primitives";
import { updateEpisode } from "@/helpers/storage-episode";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AnimeEpisodesPage() {
  const router = useParams<{ slug: string; episodes: string }>();
  const link = useRouter();
  const episodeNum = Number(router.episodes);
  const [provider, setProvider] = useState<string>("");
  const {
    data: dataEpisode,
    isError: errorEpisode,
    isLoading: loadingEpisode,
  } = useGetEpisodeQuery({ slug: router.slug, episode: router.episodes });
  const {
    data: dataAnime,
    error: errorAnime,
    isLoading: loadingAnime,
  } = useGetAnimeQuery(router.slug);
  useDynamicTitle(loadingEpisode, dataEpisode?.data?.episode);

  if (loadingEpisode || loadingAnime) return <Skeleton />;
  if (errorEpisode || errorAnime) return <>Error fetching data...</>;

  const handleAnimeEpisode = (episode: number) => {
    console.log(episode);
    link.push(`/anime/${router.slug}/episodes/${episode}`);
  };

  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{dataEpisode?.data?.episode}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <iframe
              title="anime-episode"
              className="h-[200px] w-full rounded-xl sm:h-[300px] sm:w-full md:h-[400px] md:w-full lg:h-[500px] lg:w-full xl:h-[600px] xl:w-full"
              src={
                provider === "" ? `${dataEpisode?.data?.stream_url}` : provider
              }
              allowFullScreen
            />
          </div>
          <div className="mt-4 flex flex-row items-center justify-between gap-2 max-[644px]:flex max-[644px]:flex-col sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-2 md:flex md:flex-row md:items-center md:justify-between md:gap-2 lg:flex lg:flex-row lg:items-center lg:justify-between xl:flex xl:flex-row xl:items-center xl:justify-between">
            {dataEpisode?.data?.has_previous_episode === true ? (
              <HoverCard>
                <HoverCardTrigger className="max-[644px]:w-full">
                  <Link href={`${episodeNum - 1}`}>
                    <Button
                      variant={"secondary"}
                      className={subtitle({
                        className: "rounded-lg duration-300 max-[644px]:w-full",
                      })}
                      onClick={() =>
                        updateEpisode(
                          `/anime/${router.slug}/episodes/${episodeNum - 1}`,
                          router.slug,
                        )
                      }
                    >
                      Previous
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>Back to previous episode.</HoverCardContent>
              </HoverCard>
            ) : (
              <HoverCard>
                <HoverCardTrigger className="max-[644px]:w-full">
                  <Button
                    variant={"outline"}
                    className={subtitle({
                      className:
                        "cursor-not-allowed rounded-lg text-foreground opacity-50 max-[644px]:w-full",
                    })}
                    disabled
                  >
                    Previous
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  {`Can't back to previous, because this is first episode.`}
                </HoverCardContent>
              </HoverCard>
            )}
            <Select
              onValueChange={(value: string) =>
                handleAnimeEpisode(Number(value))
              }
            >
              <SelectTrigger className="w-full max-[644px]:my-2 max-[644px]:w-full">
                <SelectValue placeholder="Select an episode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All episodes</SelectLabel>
                  {dataAnime?.data?.episode_lists.map(
                    (episode: any, index: number) => (
                      <Link
                        href={`/anime/${router.slug}/episodes/${index + 1}`}
                        key={episode.slug}
                      >
                        <SelectItem value={`${index + 1}`}>
                          {`Episode ${index + 1}`}
                        </SelectItem>
                      </Link>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(value: string) => setProvider(value)}>
              <SelectTrigger className="w-full max-[644px]:my-2 max-[644px]:w-full">
                <SelectValue placeholder="Select a media provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Media Provider</SelectLabel>
                  {dataEpisode?.data?.download_urls.mp4?.map(
                    (resolution: any) =>
                      resolution.urls.map((url: any) => (
                        <>
                          {url.provider === "Acefile" ||
                          url.provider === "KFiles" ||
                          url.provider === "Pdrain" ? (
                            <SelectItem
                              value={url.url}
                              key={
                                resolution.resolution +
                                " - " +
                                url.provider +
                                url.url
                              }
                            >
                              {resolution.resolution + " - " + url.provider}
                            </SelectItem>
                          ) : (
                            <SelectItem
                              value={url.url}
                              key={
                                resolution.resolution +
                                " - " +
                                url.provider +
                                url.url
                              }
                            >
                              {resolution.resolution +
                                " - " +
                                url.provider +
                                "⚠️"}
                            </SelectItem>
                          )}
                        </>
                      )),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {dataEpisode?.data?.has_next_episode === true ? (
              <HoverCard>
                <HoverCardTrigger className="max-[644px]:w-full">
                  <Link href={`${episodeNum + 1}`}>
                    <Button
                      variant={"secondary"}
                      className={subtitle({
                        className: "rounded-lg duration-300 max-[644px]:w-full",
                      })}
                      onClick={() =>
                        updateEpisode(
                          `/anime/${router.slug}/episodes/${episodeNum + 1}`,
                          router.slug,
                        )
                      }
                    >
                      Next
                    </Button>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>Go to next episode.</HoverCardContent>
              </HoverCard>
            ) : (
              <HoverCard>
                <HoverCardTrigger className="max-[644px]:w-full">
                  <Button
                    variant={"outline"}
                    className={subtitle({
                      className:
                        "cursor-not-allowed rounded-lg border text-foreground opacity-50 max-[644px]:w-full",
                    })}
                    disabled
                  >
                    Next
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>Latest episode end up here.</HoverCardContent>
              </HoverCard>
            )}
          </div>

          <div className="mx-auto grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <div className="mt-5 rounded-md bg-gray-100/50 p-4 dark:bg-gray-950/20">
              <p className="text-lg font-semibold">{`Download URL's .mp4`}</p>
              <ul className="mt-5">
                {dataEpisode?.data?.download_urls.mp4?.map(
                  (resolution: any) => (
                    <li key={resolution.resolution} className="mb-4 flex gap-2">
                      <p className={title({ size: "sm" })}>
                        {resolution.resolution}:
                      </p>
                      <ul className="mb-2 flex flex-wrap gap-2">
                        {resolution.urls.map((url: any) => (
                          <li key={url.provider}>
                            <Link target="_blank" href={url.url}>
                              <button
                                className={subtitle({
                                  className:
                                    "rounded-xl bg-gray-200/50 px-4 py-1 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/40 md:text-base lg:text-base xl:text-base",
                                })}
                              >
                                {url.provider}
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="mt-5 rounded-md bg-gray-100/50 p-4 dark:bg-gray-950/20 max-[768px]:mt-0">
              <p className="text-lg font-semibold">{`Download URL's .mkv`}</p>
              <ul className="mt-5">
                {dataEpisode?.data?.download_urls.mkv?.map(
                  (resolution: any) => (
                    <li key={resolution.resolution} className="mb-4 flex gap-2">
                      <p className={title({ size: "sm" })}>
                        {resolution.resolution}:
                      </p>
                      <ul className="mb-2 flex flex-wrap items-center gap-2">
                        {resolution.urls.map((url: any) => (
                          <li key={url.provider}>
                            <Link target="_blank" href={url.url}>
                              <button
                                className={subtitle({
                                  className:
                                    "rounded-xl bg-gray-200/50 px-4 py-1 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/40 md:text-base lg:text-base xl:text-base",
                                })}
                              >
                                {url.provider}
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
