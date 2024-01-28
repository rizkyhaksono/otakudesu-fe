"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetHomeQuery } from "@/redux/api/home-api";

export default function HomeCard() {
  const { data: dataHome, error: errorHome, isLoading: loadingHome } = useGetHomeQuery(arguments);

  return (
    <>
      <div className="">
        <Card>
          <CardHeader>Ongoing Anime</CardHeader>
          {dataHome && dataHome.data.ongoing_anime && (
            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 max-[640px]:grid-cols-1">
              {dataHome.data.ongoing_anime.map((anime: any) => (
                <div key={anime.slug} className="flex flex-wrap items-center space-x-4 rounded-md border p-4">
                  <img src={anime.poster} alt={anime.title} className="w-44 h-44 object-cover rounded" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{anime.title}</p>
                    <p className="text-sm text-muted-foreground">{`Episode ${anime.current_episode}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
