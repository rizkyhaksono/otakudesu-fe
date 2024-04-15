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

export default function AnimeEpisode() {
  const router = useParams<{ slug: string; episodes: string }>();
  const episodeNum = Number(router.episodes);
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
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{dataEpisode?.data?.episode}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <iframe
              title="anime-episode"
              className="lg:h-70 w-full rounded-xl max-[642px]:h-60 max-[642px]:w-7/12 sm:h-72 sm:w-8/12 md:h-80 md:w-8/12 lg:w-7/12 xl:h-96 xl:w-7/12"
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
                      <button className="rounded-lg bg-gray-200/50 px-5 py-2 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/20">
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
                      className="cursor-not-allowed rounded-lg border border-gray-600 px-5 py-2 text-foreground opacity-50 dark:border-gray-200"
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
                      <button className="rounded-lg bg-gray-200/50 px-5 py-2 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/20">
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
                      className="cursor-not-allowed rounded-lg border border-gray-600 px-5 py-2 text-foreground opacity-50 dark:border-gray-200"
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

          <div className="mx-auto">
            {dataEpisode?.data?.download_urls && (
              <div className="mt-10">
                <p className="text-lg font-semibold">{`Download URL's .mp4`}</p>
                <ul className="mt-5">
                  {dataEpisode?.data?.download_urls.mp4?.map(
                    (resolution: any) => (
                      <li
                        key={resolution.resolution}
                        className="mb-4 flex gap-2"
                      >
                        <strong className="text-base md:text-base lg:text-base xl:text-lg">
                          {resolution.resolution}:
                        </strong>
                        <ul className="mb-2 flex flex-wrap gap-2">
                          {resolution.urls.map((url: any) => (
                            <li key={url.provider}>
                              <Link target="_blank" href={url.url}>
                                <button className="rounded-xl bg-gray-200/50 px-5 py-2 text-base duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/40 md:text-base lg:text-base xl:text-base">
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
            )}

            {dataEpisode?.data?.download_urls && (
              <div className="mt-10">
                <p className="text-lg font-semibold">{`Download URL's .mkv`}</p>
                <ul className="mt-5">
                  {dataEpisode?.data?.download_urls.mkv?.map(
                    (resolution: any) => (
                      <li
                        key={resolution.resolution}
                        className="mb-4 flex gap-2"
                      >
                        <strong className="text-base md:text-base lg:text-base xl:text-lg">
                          {resolution.resolution}:
                        </strong>
                        <ul className="mb-2 flex flex-wrap gap-2">
                          {resolution.urls.map((url: any) => (
                            <li key={url.provider}>
                              <Link target="_blank" href={url.url}>
                                <button className="rounded-xl bg-gray-200/50 px-5 py-2 text-base duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/40 md:text-base lg:text-base xl:text-base">
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
