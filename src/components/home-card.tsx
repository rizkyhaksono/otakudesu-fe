"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetHomeQuery } from "@/redux/api/home-api";
import Skeleton from "./skeleton";
import Link from "next/link";

export default function HomeCard() {
  const { data: dataHome, error: errorHome, isLoading: loadingHome } = useGetHomeQuery(arguments);

  if (loadingHome) {
    <Skeleton />;
  }

  if (errorHome) {
    <>Error fetching data...</>;
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center font-bold text-2xl">Ongoing Anime</CardHeader>
        {dataHome && dataHome.data.ongoing_anime && (
          <div className="grid mx-2 gap-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 max-[640px]:grid-cols-1">
            {dataHome.data.ongoing_anime.map((anime: any) => (
              <div key={anime.slug} className="flex flex-wrap items-center space-x-4 rounded-md border p-4 dark:hover:bg-gray-950 hover:shadow-lg dark:hover:shadow-gray-900 transition duration-400">
                <Image src={anime.poster} alt={anime.title} className="xl:w-72 xl:h-72 lg:w-72 lg:h-72 md:w-56 md:h-56 sm:h-36 sm:w-36 max-[640px]:w-32 max-[640px]:h-32 object-cover rounded" width={300} height={300} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{anime.title}</p>
                  <p className="text-sm text-muted-foreground">Current Episode: {anime.current_episode}</p>
                  <p className="text-sm text-muted-foreground">Release Day: {anime.release_day}</p>
                  <p className="text-sm text-muted-foreground">Newest: {anime.newest_release_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <CardFooter className="mt-2 flex justify-end">
          <Link href={"/"}>See all</Link>
        </CardFooter>
      </Card>

      <Card className="mt-5">
        <CardHeader className="text-center font-bold text-2xl">Completed Anime</CardHeader>
        {dataHome && dataHome.data.complete_anime && (
          <div className="grid mx-2 gap-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 max-[640px]:grid-cols-1">
            {dataHome.data.complete_anime.map((anime: any) => (
              <div key={anime.slug} className="flex flex-wrap items-center space-x-4 rounded-md border p-4 dark:hover:bg-gray-950 hover:shadow-lg dark:hover:shadow-gray-900 transition duration-400">
                <Image src={anime.poster} alt={anime.title} className="xl:w-72 xl:h-72 lg:w-72 lg:h-72 md:w-56 md:h-56 sm:h-36 sm:w-36 max-[640px]:w-32 max-[640px]:h-32 object-cover rounded" width={300} height={300} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{anime.title}</p>
                  <p className="text-sm text-muted-foreground">Rate: {anime.rating}</p>
                  <p className="text-sm text-muted-foreground">Last Release Date: {anime.last_release_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <CardFooter className="mt-2 flex justify-end">
          <Link href={"/"}>See all</Link>
        </CardFooter>
      </Card>
    </>
  );
}
