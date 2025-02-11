"use client";

import { useState, FormEvent, } from "react";
import Image from "next/image";
import { useGetMovieSearchQuery } from "@/redux/api/movie/movie-search-api";
import SkeletonCard from "@/components/layout/skeleton-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export default function MovieSearchCardPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useGetMovieSearchQuery(search);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearch(formData.get("search") as string);
  };


  if (isLoading) return toast.info("Fetching data...");

  if (error) return toast.error("Error fetching data...");

  if (search.length > 0) {
    toast.success("Data fetched successfully.");
  }

  const movies = data?.data?.movies || [];

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 mb-6">
        <Input
          type="text"
          name="search"
          placeholder="Search for a movie..."
          defaultValue={search}
          className="w-full"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie: any) => (
          <Card key={movie.slug} className="hover:shadow-lg transition-shadow">
            <Image
              src={movie.image}
              alt={movie.title}
              width={152}
              height={228}
              className="rounded-lg"
            />
            <CardTitle className="mt-2 text-lg font-semibold">{movie.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {movie.year} | Rating: {movie.rating || "N/A"}
            </CardDescription>
            <CardFooter className="p-4">
              <Button variant="outline" className="w-full">
                Watch Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
