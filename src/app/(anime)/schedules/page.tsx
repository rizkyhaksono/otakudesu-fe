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
      <div className="relative mb-12 overflow-hidden border-b border-border/70 bg-card py-16 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80" />

        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 sm:text-left lg:px-8">
          <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-3xl">
            <h2 className="mb-6 font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl sm:leading-none lg:text-6xl">
              Sync Up with{" "}
              <span className="mt-2 block bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                Anime Schedules
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-base font-medium text-muted-foreground md:text-lg">
              Stay ahead of release times and catch every new episode the moment it drops. Never
              miss your favorites!
            </p>
          </div>
        </div>
      </div>

      {/* Schedules Grid */}
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
        {dataSchedules?.data?.map((data: any) => (
          <div key={data?.day} className="h-full">
            <Card className="group relative flex h-full flex-col overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex flex-1 flex-col p-6">
                <CardTitle className="mb-6 flex items-center gap-2 text-2xl font-black tracking-tight text-foreground/90 transition-colors group-hover:text-primary">
                  <svg
                    className="h-5 w-5 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {data?.day}
                </CardTitle>
                <div className="flex flex-col gap-3">
                  {data?.anime_list?.map((anime: any, index: number) => (
                    <Link
                      href={anime?.url}
                      target="_blank"
                      key={anime?.title || index}
                      className="group/item -mx-2 flex items-center justify-between rounded-md border-b border-border/30 px-2 py-2 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <span className="line-clamp-2 text-sm font-medium text-muted-foreground transition-colors group-hover/item:text-foreground">
                        {anime?.anime_name}
                      </span>
                      <svg
                        className="ml-2 h-4 w-4 flex-shrink-0 -translate-x-2 text-muted-foreground opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
