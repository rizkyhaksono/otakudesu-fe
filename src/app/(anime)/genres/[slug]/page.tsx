"use client";

import { useGetGenreSlugQuery } from "@/redux/api/genre-api";
import SkeletonCard from "@/components/layout/skeleton-card";
import { useParams, useSearchParams, usePathname, notFound } from "next/navigation";
import { useDynamicTitle } from "@/helpers/dynamic-title";
import GenresCard from "./components/genres-card";
import GenresPagination from "./components/genres-pagination";

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

  useDynamicTitle(loadingGenre, pascalCaseGenreName + " Anime");

  if (loadingGenre) {
    return <SkeletonCard />;
  }

  if (errorGenre) {
    return <>Error fetching data...</>;
  }

  if (!dataGenre?.data?.anime || dataGenre.data.anime.length === 0) return notFound();

  return (
    <>
      <GenresCard
        animeHeader={pascalCaseGenreName + " Anime"}
        animeData={dataGenre?.data?.anime}
      />

      <GenresPagination
        animeData={dataGenre?.data?.pagination}
        genreName={genreName}
      />
    </>
  );
}
