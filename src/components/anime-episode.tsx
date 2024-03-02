"use client";

import { useParams } from "next/navigation";
import { useGetEpisodeQuery } from "@/redux/api/episode-api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Skeleton from "@/components/skeleton-card";

interface Resolution {
  resolution: string;
  urls: { provider: string; url: string }[];
}

interface DownloadUrls {
  mp4?: Resolution[];
}

interface AnimeData {
  episode: string;
  stream_url: string;
  anime: {
    download_urls: DownloadUrls;
  };
}

export default function AnimeEpisode() {
  const router = useParams<{ slug: string; episodes: string }>();
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
        <CardContent className="flex flex-col items-center">
          <iframe
            className="h-96 w-full rounded-xl max-[766px]:size-full"
            src={dataEpisode?.data?.stream_url}
            allowFullScreen
          />
          <p className="mt-10">
            {dataEpisode?.data?.anime?.download_urls?.mp4?.map(
              (resolution: Resolution) => (
                <div key={resolution.resolution}>
                  <p>{resolution.resolution}</p>
                  {resolution.urls.map((url) => (
                    <a href={url.url} key={url.provider}>
                      {url.provider}
                    </a>
                  ))}
                </div>
              ),
            ) || <p>No download URLs available.</p>}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
