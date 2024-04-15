"use client";

import { useGetHomeQuery } from "@/redux/api/home-api";
import AnimeCard from "./anime-card";

export default function HomeCard() {
  const { data: dataHome, error: errorHome } = useGetHomeQuery(arguments);

  if (errorHome) {
    return <>Error fetching...</>;
  }

  return (
    <div className="container mx-auto mt-20" id="started">
      <AnimeCard
        animeData={dataHome?.data?.ongoing_anime}
        animeHeader="Ongoing Anime"
        seeAllLink="ongoing-anime"
      />

      <AnimeCard
        animeData={dataHome?.data?.complete_anime}
        animeHeader="Completed Anime"
        seeAllLink="completed-anime"
      />
    </div>
  );
}
