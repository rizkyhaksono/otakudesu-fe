"use client";

import { useGetGenreSlugQuery } from "@/redux/api/anime/anime-genre-api";
import SkeletonCard from "@/components/layout/skeleton-card";
import { useParams, useSearchParams, usePathname, notFound } from "next/navigation";
import GenresCard from "./_components/genres-card";
import GenresPagination from "./_components/genres-pagination";

export default function GenreSlugPage() {
  const param = useParams<{ slug: string }>();
  const params = useSearchParams();
  const search = params.get("page");
  const path = usePathname();
  const pathSplit = path.split("/");
  const genreName = pathSplit[2];

  const pascalCaseGenreName = genreName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const {
    data: dataGenre,
    isError: errorGenre,
    isLoading: loadingGenre,
  } = useGetGenreSlugQuery({ slug: param.slug, page: search });

  if (loadingGenre) {
    return <SkeletonCard />;
  }

  if (errorGenre) {
    return <>Error fetching data...</>;
  }

  if (!dataGenre?.data?.anime || dataGenre.data.anime.length === 0) return notFound();

  return (
    <div className="mb-2">
      <GenresCard
        animeHeader={pascalCaseGenreName + " Anime"}
        animeData={dataGenre?.data?.anime}
      />

      <GenresPagination
        animeData={dataGenre?.data?.pagination}
        genreName={genreName}
      />
    </div>
  );
}
