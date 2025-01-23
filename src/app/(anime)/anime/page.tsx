"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetSearchQuery } from "@/redux/api/anime/anime-search-api";
import AnimeSearchCard from "@/app/(anime)/anime/_components/anime-search-card";

export default function AnimeSearchPage() {
  const [search, setSearch] = useState("");
  const { data: dataAnime } = useGetSearchQuery(search);

  return (
    <div className="container mx-auto">
      <div className="mx-auto px-4 py-10 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
        <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
            Discover Your{" "}
            <span className="leading-12 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Anime Journey
            </span>
          </h2>
          <p className="mb-6 text-base text-foreground md:text-lg">
            {`Start your anime search from your heart's choice!`}
          </p>
          <div className="mt-10 flex gap-2 max-[640px]:flex-wrap">
            <Input
              className="border-gray-600"
              type="text"
              placeholder="Search anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="max-[640px]:w-full" type="submit">
              Search
            </Button>
          </div>
        </div>
      </div>

      <AnimeSearchCard anime={dataAnime?.data} />
    </div>
  );
}
