"use client";

import { useGetGenresQuery } from "@/redux/api/anime/anime-genre-api";
import { Card, CardHeader } from "@/components/ui/card";
import SkeletonCard from "@/components/layout/skeleton-card";
import Link from "next/link";
import { TiltCard } from "@/components/ui/tilt-card";

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
    <div className="min-h-screen pb-16">
      {/* Genres Hero Header */}
      <div className="relative overflow-hidden bg-card border-b border-border/70 shadow-sm mb-12 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background opacity-80 pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-4 max-[640px]:text-center sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl">
          <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-3xl">
            <h2 className="mb-6 font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl sm:leading-none">
              Discover Your
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                Anime Genres
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg font-medium max-w-xl mx-auto">
              {"Dive into endless worlds. From high-octane action to heartwarming slice-of-life charm, find exactly what you're craving."}
            </p>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="container mx-auto px-4 grid gap-4 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {dataGenres?.data.map((genre: any) => (
          <TiltCard key={genre.slug} maxRotation={10} perspective={800} scale={1.05} transitionSpeed={250}>
            <Link href={`/genres/${genre.slug}?page=1`} className="block h-full">
              <Card className="flex items-center justify-center h-full min-h-[100px] text-center text-foreground transition-all duration-300 border-border/60 bg-card/60 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/20 group relative overflow-hidden rounded-xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-4 w-full flex items-center justify-center">
                  <span className="font-bold tracking-wide uppercase max-[640px]:text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base z-10 group-hover:scale-110 transition-transform duration-300">
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
