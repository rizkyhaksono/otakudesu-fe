"use client";

import { useGetGenresQuery } from "@/redux/api/genre-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "./skeleton";
import Link from "next/link";

export default function GenresList() {
  const { data: dataGenres, error: errorGenres, isLoading: loadingGenres } = useGetGenresQuery(arguments);

  if (loadingGenres) {
    <Skeleton />;
  }

  if (errorGenres) {
    <>Error fetching data...</>;
  }

  const handleCardClick = (slug: any) => {
    console.log("Clicked on genre with slug:", slug);
  };

  return (
    <>
      {dataGenres && dataGenres.data && (
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 max-[640px] gap-2">
          {dataGenres.data.map((genre: any) => (
            <Card key={genre.slug} className="text-center text-foreground dark:hover:bg-gray-950 hover:shadow-lg dark:hover:shadow-gray-900 transition duration-400" onClick={() => handleCardClick(genre)}>
              <CardHeader>
                <Link href={`/genres/${genre.slug}`}>
                  <CardTitle className="text-lg">{genre.name}</CardTitle>
                </Link>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
