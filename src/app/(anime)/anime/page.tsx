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
    <div className="container mx-auto min-h-screen">
      {/* Search Hero Section */}
      <div className="relative mb-10 overflow-hidden rounded-b-3xl border-b border-border/70 bg-card pb-12 pt-16 shadow-sm">
        {/* Background Decorative Element */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-80" />

        <div className="relative z-10 mx-auto px-4 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
          <div className="max-w-3xl sm:mx-auto sm:text-center">
            <h2 className="mb-4 text-center font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Anime Journey
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-center text-base font-medium text-muted-foreground md:text-lg">
              Start your anime search from your heart&apos;s choice! Explore thousands of titles
              instantly.
            </p>

            {/* Glassmorphic Search Bar */}
            <div className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-primary/20 bg-background/50 p-2 shadow-lg backdrop-blur-md transition-all focus-within:border-primary/50 focus-within:shadow-primary/10 hover:border-primary/30 sm:gap-3 sm:p-3">
              <svg
                className="ml-3 h-5 w-5 flex-shrink-0 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                className="flex-1 border-0 bg-transparent px-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                type="text"
                placeholder="Search for anime, genres, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                className="rounded-xl px-6 font-semibold shadow-md transition-transform active:scale-95"
                type="submit"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-12 sm:px-6 lg:px-8">
        {search && dataAnime?.data?.length > 0 && (
          <h3 className="mb-6 text-2xl font-bold tracking-tight">Search Results</h3>
        )}
        <AnimeSearchCard anime={dataAnime?.data} />
      </div>
    </div>
  );
}
