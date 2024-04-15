"use client";

import { useGetGenresQuery } from "@/redux/api/genre-api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonCard from "@/components/layout/skeleton-card";
import Link from "next/link";

export default function GenrePage() {
  const {
    data: dataGenres,
    error: errorGenres,
    isLoading: loadingGenres,
  } = useGetGenresQuery(arguments);

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
            Discover Your{" "}
            <span className="leading-12 bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              &nbsp;Anime Genres
            </span>
          </h2>
          <p className="text-base text-foreground md:text-lg">
            Explore the vast realm of anime genres, be it the excitement of
            action, the magical allure of fantasy, the heartwarming embrace of
            romance, or the delightful charm of slice-of-life. Your anime
            journey commences wherever your passions lead!
          </p>
        </div>
      </div>

      <div className="container mx-auto grid gap-2 pb-10 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {dataGenres?.data.map((genre: any) => (
          <Link href={`/genres/${genre.slug}?page=1`} key={genre.slug}>
            <Card className="text-center text-foreground transition duration-300 hover:scale-105 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black">
              <CardHeader>
                <CardTitle className="max-[640px]:text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl">
                  {genre.name}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
