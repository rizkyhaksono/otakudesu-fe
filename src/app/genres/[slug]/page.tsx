"use client";

import { useGetGenreSlugQuery } from "@/redux/api/genre-api";
import { usePathname, useSearchParams } from "next/navigation";

export default function GenreSlug() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathPath = pathname.split("/");
  const slugPath = pathPath[2];
  const page = searchParams.get("page");

  const { data: dataGenreSlug, isLoading: loadingGenreSlug, error: errorGenreSlug } = useGetGenreSlugQuery({ slug: slugPath, page: page ? parseInt(page, 10) : 1 });

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
          </div>
        ))}
      </div>
    </>
  );
}
