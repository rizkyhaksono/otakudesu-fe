"use client";

import { useGetGenreSlugQuery } from "@/redux/api/genre-api";
import { Card, CardHeader, CardTitle } from "./ui/card";
import Skeleton from "./skeleton";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function GenreSlug() {
  const router = useParams<{ slug: string }>();
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
  } = useGetGenreSlugQuery({ slug: router.slug, page: search });

  if (loadingGenre) {
    return <Skeleton />;
  }

  if (errorGenre) {
    return <>Error fetching data...</>;
  }

  return (
    <>
      <p className="container mx-auto mt-10 text-center text-4xl font-semibold">
        {pascalCaseGenreName}
      </p>
      <div className="container mx-auto my-10 grid gap-4 max-[766px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {dataGenre &&
          dataGenre.data &&
          dataGenre.data.anime.map((anime: any) => (
            <Link key={anime.slug} href={`/anime/${anime.slug}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{anime.title}</CardTitle>
                </CardHeader>
                <Image
                  className="w-full rounded-xl object-cover"
                  width={300}
                  height={300}
                  src={anime.poster}
                  alt={anime.title}
                />
              </Card>
            </Link>
          ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {dataGenre?.data &&
              dataGenre.data.pagination.map((anime: any) => {
                <PaginationPrevious
                  href={`/${genreName}/${
                    anime?.current_page > 1 ? anime?.current_page - 1 : null
                  }`}
                />;
              })}
          </PaginationItem>
          {dataGenre?.data &&
            dataGenre.data.anime.map((anime: any) => (
              <PaginationItem key={anime.slug}>
                <PaginationLink href={`/${genreName}/${anime.page}`}>
                  {anime.page}
                </PaginationLink>
              </PaginationItem>
            ))}
          <PaginationItem>
            <PaginationNext
              href={`/${genreName}/${
                dataGenre?.data &&
                dataGenre?.pagination.current_page <
                  dataGenre?.pagination.total_pages
                  ? dataGenre?.pagination.current_page + 1
                  : null
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
