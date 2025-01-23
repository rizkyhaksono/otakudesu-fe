"use client";

import OngoingCard from "../../_components/ongoing-card";
import OngoingPagination from "./components/ongoing-pagination";
import { useGetOnGoingAnimeQuery } from "@/redux/api/anime/anime-ongoing-api";
import { notFound, usePathname } from "next/navigation";

export default function OngoingAnimePage() {
  const path = usePathname();
  const pathSplit = path.split("/");
  const pageCurrent = pathSplit[2];

  const { data: dataOngoing, isError: errorOngoing } = useGetOnGoingAnimeQuery({
    page: pageCurrent,
  });

  if (errorOngoing) {
    return <>Error fetching data...</>;
  }

  if (dataOngoing?.data?.ongoingAnimeData.length === 0) return notFound();

  return (
    <div className="container mx-auto">
      <OngoingCard
        animeData={dataOngoing?.data?.ongoingAnimeData}
        animeHeader={"On Going Anime"}
        seeAllLink={""}
      />

      <OngoingPagination ongoingData={dataOngoing?.data?.paginationData} />
    </div>
  );
}
