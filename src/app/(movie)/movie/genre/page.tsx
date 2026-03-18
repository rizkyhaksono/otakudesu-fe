"use client";

import { useGetMovieGenresQuery } from "@/redux/api/movie/movie-genre-api";
import { Card, CardHeader } from "@/components/ui/card";
import SkeletonCard from "@/components/layout/skeleton-card";
import Link from "next/link";

export default function MovieGenrePage() {
  const {
    data: dataGenres,
    error: errorGenres,
    isLoading: loadingGenres,
  } = useGetMovieGenresQuery({});

  console.log("Movie Genres Data:", dataGenres);

  if (loadingGenres) {
    return <SkeletonCard />;
  }

  if (errorGenres) {
    return <>Error fetching data...</>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 text-center sm:px-6 sm:text-left lg:px-8">
        <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
            Discover Your{" "}
            <span className="leading-12 bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
              Movie Genres
            </span>
          </h2>
          <p className="text-base text-foreground md:text-lg">
            Explore movies across action, drama, comedy, thriller, and more exciting genres.
          </p>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-2 gap-2 px-4 pb-10 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6">
        {dataGenres?.data?.map((genre: { slug: string; name: string }) => (
          <Link href={`/movie/genre/${genre.slug}?page=1`} key={genre.slug}>
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
