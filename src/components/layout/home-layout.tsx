"use client";

import { useGetHomeQuery } from "@/redux/api/home-api";
import OngoingCard from "./ongoing-card";
import CompletedAnime from "./completed-card";

export default function HomeCard() {
  const { data: dataHome, error: errorHome } = useGetHomeQuery(arguments);

  if (errorHome) return <>Error fetching...</>;

  return (
    <div className="container mx-auto mt-20" id="started">
      <OngoingCard
        animeData={dataHome?.data?.ongoing_anime}
        animeHeader="On Going Anime"
        seeAllLink="ongoing-anime"
      />

      <CompletedAnime
        animeData={dataHome?.data?.complete_anime}
        animeHeader="Completed Anime"
        seeAllLink="completed-anime"
      />
    </div>
  );
}
