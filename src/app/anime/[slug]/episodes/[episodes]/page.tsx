"use client";

import { useParams } from "next/navigation";
import { useGetEpisodeQuery } from "@/redux/api/episode-api";
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

export default function AnimeEpisodesPage() {
  const router = useParams<{ slug: string; episodes: string }>();
  const episodeNum = Number(router.episodes);
  const {
    data: dataEpisode,
    isError: errorEpisode,
    isLoading: loadingEpisode,
  } = useGetEpisodeQuery({ slug: router.slug, episode: router.episodes });

  useDynamicTitle(loadingEpisode, dataEpisode?.data?.episode);

  if (loadingEpisode) {
    return <Skeleton />;
  }

  if (errorEpisode) {
    return <>Error fetching data...</>;
  }

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
              src={dataEpisode?.data?.stream_url}
              allowFullScreen
            />
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              {dataEpisode?.data?.has_previous_episode === true ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <Link href={`${episodeNum - 1}`}>
                      <button
                        className={subtitle({
                          className:
                            "rounded-lg bg-gray-200/50 px-5 py-2 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/20",
                        })}
                      >
                        Previous
                      </button>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent>Back to previous episode.</HoverCardContent>
                </HoverCard>
              ) : (
                <HoverCard>
                  <HoverCardTrigger>
                    <button
                      className={subtitle({
                        className:
                          "cursor-not-allowed rounded-lg border border-gray-600 px-5 py-2 text-foreground opacity-50 dark:border-gray-200",
                      })}
                      disabled
                    >
                      Previous
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    {`Can't back to previous, because this is first episode.`}
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
            <div>
              {dataEpisode?.data?.has_next_episode === true ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <Link href={`${episodeNum + 1}`}>
                      <button
                        className={subtitle({
                          className:
                            "rounded-lg bg-gray-200/50 px-5 py-2 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/20",
                        })}
                      >
                        Next
                      </button>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent>Go to next episode.</HoverCardContent>
                </HoverCard>
              ) : (
                <HoverCard>
                  <HoverCardTrigger>
                    <button
                      className={subtitle({
                        className:
                          "cursor-not-allowed rounded-lg border border-gray-600 px-5 py-2 text-foreground opacity-50 dark:border-gray-200",
                      })}
                      disabled
                    >
                      Next
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Latest episode end up here.
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
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
