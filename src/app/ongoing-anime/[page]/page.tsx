"use client";

import OngoingCard from "@/components/layout/ongoing-card";
import OngoingPagination from "./components/ongoing-pagination";
import { useGetOnGoingAnimeQuery } from "@/redux/api/ongoinganime-api";
import { usePathname } from "next/navigation";

export default function OngoingAnimePage() {
  const path = usePathname();
  const pathSplit = path.split("/");
  const pageCurrent = pathSplit[2];

  const { data: dataOngoing, isError: errorOngoing } = useGetOnGoingAnimeQuery({
    page: pageCurrent,
  });

  console.log(dataOngoing);

  if (errorOngoing) {
    return <>Error fetching data...</>;
  }

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
