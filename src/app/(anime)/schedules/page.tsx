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
    <>
      <div className="container mx-auto px-4 py-10 max-[640px]:text-center sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl">
        <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
            Sync Up with<span className="leading-12 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">&nbsp;Anime</span>
          </h2>
          <p className="text-base text-foreground md:text-lg">
            {
              "Stay Ahead of Release Times and Catch Every New Episode on Schedule!."
            }
          </p>
        </div>
      </div>

      <div className="container mx-auto grid gap-2 pb-10 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {dataSchedules?.data?.map((data: any) => (
          <div key={data?.title}>
            <Card className="h-full items-center rounded-md transition duration-300 hover:bg-muted/40">
              <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                <CardTitle className="text-2xl font-bold">{data?.day}</CardTitle>
                <div className="flex flex-col gap-2 pt-6">
                  {data?.anime_list?.map((anime: any) => (
                    <Link
                      href={anime?.url}
                      target="_blank"
                      key={anime?.title}
                      className="hover:underline hover:underline-offset-4"
                    >
                      <p className="text-sm font-normal">{anime?.anime_name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  )
}