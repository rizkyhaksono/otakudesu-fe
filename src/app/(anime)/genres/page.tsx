"use client";

import { useGetGenresQuery } from "@/redux/api/anime/anime-genre-api";
import { Card, CardHeader } from "@/components/ui/card";
import SkeletonCard from "@/components/layout/skeleton-card";
import Link from "next/link";

export default function GenrePage() {
  const {
    data: dataGenres,
    error: errorGenres,
    isLoading: loadingGenres,
  } = useGetGenresQuery({});

  if (loadingGenres) {
    return <SkeletonCard />;
  }

  if (errorGenres) {
    return <>Error fetching data...</>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 max-[640px]:text-center sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl">
        <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
            Discover Your<span className="leading-12 bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">&nbsp;Anime Genres</span>
          </h2>
          <p className="text-base text-foreground md:text-lg">
            {
              "Discover anime's action, fantasy, romance, and slice-of-life charm."
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto grid gap-2 pb-10 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {dataGenres?.data.map((genre: any) => (
          <Link href={`/genres/${genre.slug}?page=1`} key={genre.slug}>
            <Card className="text-center text-foreground transition duration-300 hover:bg-muted/20">
              <CardHeader className="font-semibold max-[640px]:text-sm sm:text-sm md:text-base lg:text-base xl:text-lg">
                {genre.name}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
