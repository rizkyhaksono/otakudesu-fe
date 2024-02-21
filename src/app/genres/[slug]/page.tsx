"use client";

import { useGetGenreSlugQuery } from "@/redux/api/genre-api";
import { usePathname } from "next/navigation";

export default function GenreSlug() {
  const pathname = usePathname();

  const pathPath = pathname.split("/");
  const slugPath = pathPath[2];
  console.log(slugPath);

  const { data: dataGenreSlug, isLoading: loadingGenreSlug, error: errorGenreSlug } = useGetGenreSlugQuery({ slug: slugPath, page: 4 });

  if (loadingGenreSlug) {
    return <p>Loading...</p>;
  }

  if (errorGenreSlug) {
    return <p>Error fetching...</p>;
  }

  return (
    <>
      <div>
        {dataGenreSlug.data.anime.map((value: any, index: number) => (
          <div key={index}>
            <h1>{value.title}</h1>
            <p>{value.slug}</p>
          </div>
        ))}
      </div>
    </>
  );
}
