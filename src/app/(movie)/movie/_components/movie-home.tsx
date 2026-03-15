"use client";

import { useGetMovieHomeQuery } from "@/redux/api/movie/movei-home-api";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";
import SharedHeroCarousel, { HeroCarouselItem } from "@/components/layout/shared-hero-carousel";

export default function MovieHome() {
  const { data: movieData, error: movieError, isLoading } = useGetMovieHomeQuery({});

  if (isLoading) return <SkeletonCard />;
  if (movieError) return <div>Error loading movies!</div>;

  const heroItems: HeroCarouselItem[] =
    movieData?.data?.movies?.slice(0, 5).map((movie: any) => ({
      id: movie.slug,
      title: movie.title,
      image: movie.image,
      url: `/movie/detail/${movie.slug}`,
      badge: "Featured Movie",
      tags: [movie.quality, `⭐ ${movie.rating}`, movie.year],
      description:
        "Discover the latest and greatest anime movies. Watch now in high quality and join a community of movie enthusiasts!",
      primaryButtonText: "Watch Movie",
      secondaryButtonText: "Details",
    })) || [];

  return (
    <div className="mb-10 flex w-full flex-col">
      {heroItems.length > 0 && <SharedHeroCarousel items={heroItems} />}
      <div className="container mx-auto mt-10 space-y-6 px-4">
        <Typography.H2 className="mb-5 text-center">Latest Movies</Typography.H2>
        <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {movieData?.data?.movies.map((movie: any) => (
            <div key={movie.title}>
              <Link href={`/movie/detail/${movie.slug}`}>
                <Card className="h-full items-center rounded-md transition duration-300 hover:bg-muted/40">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    width={1000}
                    height={1000}
                    className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                    loading="lazy"
                  />
                  <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                    <Typography.H4>{movie.title}</Typography.H4>
                    <Typography.P>Quality: {movie.quality}</Typography.P>
                    <Typography.P>Rating: {movie.rating}</Typography.P>
                    <Typography.P>Year Release: {movie.year}</Typography.P>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
