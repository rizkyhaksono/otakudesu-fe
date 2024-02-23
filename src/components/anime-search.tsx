"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAnimeQuery } from "@/redux/api/anime-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "./skeleton";

interface AnimeCardProps {
  anime: {
    title: string;
    poster: string;
    synopsis: string;
    rating: string;
    episode_lists: Array<{
      episode: string;
      slug: string;
      otakudesu_url: string;
    }>;
  };
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Card className="container mx-auto">
      <CardHeader>
        <CardTitle>{anime.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image width={200} height={400} src={anime.poster} alt={anime.title} />
        <p>{anime.synopsis}</p>
        <div>
          <h3>Episode Lists:</h3>
          <ul>
            {anime.episode_lists.map((episode) => (
              <li key={episode.slug}>
                <p>{episode.episode}</p>
                <a href={episode.otakudesu_url} target="_blank" rel="noopener noreferrer">
                  Watch Episode
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <p>Rating: {anime.rating}</p>
      </CardFooter>
    </Card>
  );
};

export default function AnimeSearch() {
  const [search, setSearch] = useState("");
  const { data: dataAnime, isLoading: loadingAnime, error: errorAnime } = useGetAnimeQuery(search);

  useEffect(() => {
    console.log(dataAnime);
  }, [dataAnime]);

  return (
    <>
      <div className="flex container w-full items-center mt-10 space-x-2">
        <Input type="text" placeholder="Search anime..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit" onClick={() => console.log("Searching for:", search)}>
          Search
        </Button>
      </div>
      <div className="mt-10 flex justify-center w-full">{dataAnime && <AnimeCard anime={dataAnime.data} />}</div>
    </>
  );
}
