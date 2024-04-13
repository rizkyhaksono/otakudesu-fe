"use client";

import { useGetOnGoingAnimeQuery } from "@/redux/api/ongoinganime-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Link from "next/link";
import Image from "next/image";
import SkeletonCard from "./skeleton-card";

export default function OngoingAnime() {
  const {
    data: onGoingAnimeData,
    isError: onGoingAnimeError,
    isLoading: onGoingAnimeLoading,
  } = useGetOnGoingAnimeQuery({ page: 1 });

  if (onGoingAnimeLoading) return <SkeletonCard />;
  if (onGoingAnimeError) return <div>Error fetching data...</div>;

  return (
    <div className="container mx-auto my-10">
      <p className="text-center text-3xl font-semibold">On Going Anime</p>
      <div className="mt-5">
        {onGoingAnimeData?.data && (
          <div
            className="grid gap-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            key={onGoingAnimeData?.data?.paginationData?.current_page}
          >
            {onGoingAnimeData?.data?.ongoingAnimeData.map((anime: any) => (
              <Link href={`/anime/${anime.slug}`} key={anime.slug}>
                <div
                  key={anime.slug}
                  className="flex flex-wrap items-center space-x-4 rounded-md border p-4 transition duration-300 hover:translate-y-2 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black"
                >
                  <Image
                    src={anime.poster}
                    alt={anime.title}
                    className="rounded object-cover max-[640px]:h-32 max-[640px]:w-32 sm:h-36 sm:w-36 md:h-56 md:w-56 lg:h-72 lg:w-72 xl:h-72 xl:w-72"
                    width={300}
                    height={300}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="my-2 text-xl font-semibold leading-none max-[766px]:text-lg">
                      {anime.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current Episode: {anime.current_episode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Release Day: {anime.release_day}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last Release Date: {anime.newest_release_date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
