"use client";

import { useGetMovieGenreSlugQuery } from "@/redux/api/movie/movie-genre-api";
import SkeletonCard from "@/components/layout/skeleton-card";
import { useParams, useSearchParams, usePathname, notFound } from "next/navigation";
import MovieGenreCard from "./_components/movie-genre-card";
import MovieGenrePagination from "./_components/movie-genre-pagination";

export default function MovieGenreSlugPage() {
  const param = useParams<{ slug: string }>();
  const params = useSearchParams();
  const search = params.get("page") || "1";
  const path = usePathname();
  const pathSplit = path.split("/");
  const genreName = pathSplit[3];

  const pascalCaseGenreName = genreName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const {
    data: dataGenre,
    isError: errorGenre,
    isLoading: loadingGenre,
  } = useGetMovieGenreSlugQuery({ slug: param.slug, page: search });

  if (loadingGenre) {
    return <SkeletonCard />;
  }

  if (errorGenre) {
    return <>Error fetching data...</>;
  }

  if (!dataGenre?.data?.movies || dataGenre.data.movies.length === 0) return notFound();

  return (
    <div className="mb-2">
      <MovieGenreCard
        movieHeader={pascalCaseGenreName + " Movies"}
        movieData={dataGenre?.data?.movies}
      />

      <MovieGenrePagination paginationData={dataGenre?.data?.pagination} genreName={genreName} />
    </div>
  );
}
