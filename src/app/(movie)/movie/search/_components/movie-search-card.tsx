"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMovieSearchQuery } from "@/redux/api/movie/movie-search-api";
import SkeletonCard from "@/components/layout/skeleton-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function MovieSearchCardPage() {
  const [search, setSearch] = useState("");
  const { data: movieSearch, error, isLoading } = useGetMovieSearchQuery(search, { skip: !search });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearch(formData.get("search") as string);
  };

  if (error) return toast.error("Error fetching data...");

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6 mt-4 flex flex-col gap-2 sm:flex-row">
        <Input type="text" name="search" placeholder="Search for a movie..." className="w-full" />
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
      </form>

      {isLoading && <SkeletonCard />}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movieSearch?.data?.movies.map((movie: any) => (
          <Link key={movie.slug} href={`/movie/detail/${movie.slug}`}>
            <Card className="h-full items-center rounded-md transition duration-300 hover:bg-muted/40">
              <Image
                src={movie.image}
                alt={movie.title}
                className="h-36 w-full rounded-t-lg object-cover sm:h-80 md:h-72 lg:h-72 xl:h-96"
                width={1000}
                height={1000}
              />
              <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                <CardTitle className="mt-2 text-lg font-semibold">{movie.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {movie.year} | Rating: {movie.rating || "N/A"}
                </CardDescription>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
