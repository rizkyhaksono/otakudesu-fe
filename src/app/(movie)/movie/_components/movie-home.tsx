"use client";

import { useGetMovieHomeQuery } from "@/redux/api/movie/movei-home-api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="container mx-auto mt-10 px-4">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-primary" />
          <Typography.H3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Latest Movies
          </Typography.H3>
        </div>
        <div className="grid gap-3 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {movieData?.data?.movies.map((movie: any) => (
            <Link key={movie.title} href={`/movie/detail/${movie.slug}`} className="group h-full">
              <Card className="h-full overflow-hidden border-border/60 bg-card/90 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:shadow-md">
                <div className="relative overflow-hidden">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    width={1000}
                    height={1000}
                    className="rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-[1.06] max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {movie.quality && (
                    <Badge className="absolute right-2 top-2 bg-background/80 text-xs backdrop-blur-sm">
                      {movie.quality}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 space-y-1 px-3 pb-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-5">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {movie.year} {movie.rating && `· ⭐ ${movie.rating}`}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
