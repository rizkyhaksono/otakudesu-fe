"use client";

import { useGetGenresQuery } from "@/redux/api/anime/anime-genre-api";
import { Card, CardHeader } from "@/components/ui/card";
import SkeletonCard from "@/components/layout/skeleton-card";
import Link from "next/link";
import { TiltCard } from "@/components/ui/tilt-card";

export default function GenrePage() {
  const { data: dataGenres, error: errorGenres, isLoading: loadingGenres } = useGetGenresQuery({});

  if (loadingGenres) {
    return <SkeletonCard />;
  }

  if (errorGenres) {
    return <>Error fetching data...</>;
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Genres Hero Header */}
      <div className="relative mb-12 overflow-hidden border-b border-border/70 bg-card py-16 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background opacity-80" />

        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 sm:text-left lg:px-8">
          <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-3xl">
            <h2 className="mb-6 font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl sm:leading-none lg:text-6xl">
              Discover Your{" "}
              <span className="mt-2 block bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                Anime Genres
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-base font-medium text-muted-foreground md:text-lg">
              {
                "Dive into endless worlds. From high-octane action to heartwarming slice-of-life charm, find exactly what you're craving."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="container mx-auto grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6">
        {dataGenres?.data.map((genre: any) => (
          <TiltCard
            key={genre.slug}
            maxRotation={10}
            perspective={800}
            scale={1.05}
            transitionSpeed={250}
          >
            <Link href={`/genres/${genre.slug}?page=1`} className="block h-full">
              <Card className="group relative flex h-full min-h-[100px] items-center justify-center overflow-hidden rounded-xl border-border/60 bg-card/60 text-center text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardHeader className="flex w-full items-center justify-center p-4">
                  <span className="z-10 font-bold uppercase tracking-wide transition-transform duration-300 group-hover:scale-110 max-[640px]:text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base">
                    {genre.name}
                  </span>
                </CardHeader>
              </Card>
            </Link>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
