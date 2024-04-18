"use client";

import { useGetGenreSlugQuery } from "@/redux/api/genre-api";
import SkeletonCard from "@/components/layout/skeleton-card";
import Link from "next/link";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDynamicTitle } from "@/helpers/dynamic-title";
import GenresCard from "./components/genres-card";

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

  return (
    <>
      <GenresCard
        animeHeader={pascalCaseGenreName + " Anime"}
        animeData={dataGenre?.data?.anime}
      />

      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            {dataGenre?.data?.pagination?.has_previous_page && (
              <PaginationPrevious
                href={`/genres/${genreName}/?page=${dataGenre?.data?.pagination?.previous_page}`}
              />
            )}
          </PaginationItem>

          <PaginationLink
            href={`/genres/${genreName}/?page=${dataGenre?.data?.pagination?.current_page}`}
            isActive={true}
          >
            {dataGenre?.data?.pagination?.current_page}
          </PaginationLink>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <PaginationEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col">
              <DropdownMenuLabel>All Pages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="m-3 grid grid-cols-5">
                {[...Array(dataGenre?.data?.pagination?.last_visible_page)].map(
                  (_, index) => (
                    <Link
                      key={_}
                      href={`/genres/${genreName}/?page=${index + 1}`}
                    >
                      <DropdownMenuItem
                        onClick={() => console.log(index + 1)}
                        className={`mb-2 mr-2 flex cursor-pointer justify-center ${
                          Number(search) === index + 1
                            ? "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white"
                            : ""
                        }`}
                      >
                        {index + 1}
                      </DropdownMenuItem>
                    </Link>
                  ),
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <PaginationItem>
            {dataGenre?.data?.pagination?.has_next_page && (
              <PaginationNext
                href={`/genres/${genreName}/?page=${dataGenre?.data?.pagination?.next_page}`}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
