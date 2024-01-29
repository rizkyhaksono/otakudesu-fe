"use client";

import { useGetGenresQuery } from "@/redux/api/genre-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "./skeleton";

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
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 max-[640px]:grid-cols-2 gap-4">
          {dataGenres.data.map((genre: any) => (
            <Card key={genre.slug} className="px-5 py-2 text-foreground" onClick={() => handleCardClick(genre.slug)}>
              {genre.name}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
