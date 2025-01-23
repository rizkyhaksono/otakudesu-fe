"use client";

import { useGetMovieHomeQuery } from "@/redux/api/movie/movei-home.api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";

export default function MovieHome() {
  const { data: movieData, error: movieError, isLoading } = useGetMovieHomeQuery({})

  if (isLoading) return <SkeletonCard />;
  if (movieError) return <div>Error loading movies!</div>;

  console.log(movieData)

  return (
    <>
      <Typography.H2 className="text-center mb-5">Latest Movies</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {movieData?.data?.movies.map((movie: any) => (
          <Card key={movie.title} className="shadow-lg hover:shadow-xl transition-shadow text-start">
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={movie.image}
                alt={movie.title}
                width={1000}
                height={1000}
                className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                loading="lazy"
              />
              <div className="mt-4">
                <Typography.P>Quality: {movie.quality}</Typography.P>
                <Typography.P>Rating: {movie.rating}</Typography.P>
                <Typography.P>Year Release: {movie.year}</Typography.P>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}