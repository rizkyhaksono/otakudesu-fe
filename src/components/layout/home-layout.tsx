"use client";

import { useGetHomeQuery } from "@/redux/api/home-api";
import OngoingCard from "./ongoing-card";
import CompletedCard from "./completed-card";
import dynamic from "next/dynamic";
const LastWatched = dynamic(() => import("./last-watched"), {
  ssr: false,
});

export default function HomeCard() {
  const { data: dataHome, error: errorHome } = useGetHomeQuery(arguments);

  if (errorHome) return <>Error fetching...</>;

  return (
    <div className="container mx-auto mt-20" id="started">
      <LastWatched />

      <OngoingCard
        animeData={dataHome?.data?.ongoing_anime}
        animeHeader="On Going Anime"
        seeAllLink="ongoing-anime"
      />

      <CompletedCard
        animeData={dataHome?.data?.complete_anime}
        animeHeader="Completed Anime"
        seeAllLink="completed-anime"
      />
    </div>
  );
}
