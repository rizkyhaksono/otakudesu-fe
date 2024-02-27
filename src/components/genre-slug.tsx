"use client";

import { useGetGenreSlugQuery } from "@/redux/api/genre-api";
import Skeleton from "./skeleton";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
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
      <div className="container mx-auto my-10 grid grid-cols-4">
        {dataGenre &&
          dataGenre.data &&
          dataGenre.data.anime.map((anime: any) => (
            <div key={anime.slug}>
              <h2>{anime.title}</h2>
              <Image
                width={300}
                height={300}
                src={anime.poster}
                alt={anime.title}
              />
            </div>
          ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
