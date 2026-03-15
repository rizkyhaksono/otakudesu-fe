"use client";

import { useGetSchedulesQuery } from "@/redux/api/anime/anime-schedules-api";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import SkeletonCard from "@/components/layout/skeleton-card";

export default function SchedulesPage() {
  const {
    data: dataSchedules,
    error: errorSchedules,
    isLoading: loadingSchedules,
  } = useGetSchedulesQuery({});

  if (loadingSchedules) {
    return <SkeletonCard />;
  }

  if (errorSchedules) {
    return <>Error fetching data...</>;
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Schedules Hero Header */}
      <div className="relative overflow-hidden bg-card border-b border-border/70 shadow-sm mb-12 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80 pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-4 max-[640px]:text-center sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl">
          <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-3xl">
            <h2 className="mb-6 font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl sm:leading-none">
              Sync Up with
              <span className="block mt-2 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                Anime Schedules
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg font-medium max-w-xl mx-auto">
              Stay ahead of release times and catch every new episode the moment it drops. Never miss your favorites!
            </p>
          </div>
        </div>
      </div>

      {/* Schedules Grid */}
      <div className="container mx-auto px-4 grid gap-6 max-[640px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dataSchedules?.data?.map((data: any) => (
          <div key={data?.day} className="h-full">
            <Card className="h-full overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50 group relative flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 flex-1 flex flex-col">
                <CardTitle className="text-2xl font-black tracking-tight mb-6 text-foreground/90 group-hover:text-primary transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {data?.day}
                </CardTitle>
                <div className="flex flex-col gap-3">
                  {data?.anime_list?.map((anime: any, index: number) => (
                    <Link
                      href={anime?.url}
                      target="_blank"
                      key={anime?.title || index}
                      className="group/item flex items-center justify-between py-2 border-b border-border/30 last:border-0 hover:bg-muted/30 rounded-md px-2 -mx-2 transition-colors"
                    >
                      <span className="text-sm font-medium text-muted-foreground group-hover/item:text-foreground line-clamp-2 transition-colors">
                        {anime?.anime_name}
                      </span>
                      <svg className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}