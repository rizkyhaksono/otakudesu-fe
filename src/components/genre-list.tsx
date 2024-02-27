"use client";

import { useGetGenresQuery } from "@/redux/api/genre-api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "./skeleton";
import Link from "next/link";

export default function GenresList() {
  const {
    data: dataGenres,
    error: errorGenres,
    isLoading: loadingGenres,
  } = useGetGenresQuery(arguments);

  if (loadingGenres) {
    return <Skeleton />;
  }

  if (errorGenres) {
    return <>Error fetching data...</>;
  }

  return (
    <>
      {dataGenres && dataGenres.data && (
        <div className="container mx-auto grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {dataGenres.data.map((genre: any) => (
            <>
              <Link href={`/genres/${genre.slug}?page=1`}>
                <Card
                  key={genre.slug}
                  className="text-center text-foreground transition duration-300 hover:translate-y-2 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black"
                >
                  <CardHeader>
                    <CardTitle className="max-[640px]:text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl">
                      {genre.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </>
          ))}
        </div>
      )}
    </>
  );
}
