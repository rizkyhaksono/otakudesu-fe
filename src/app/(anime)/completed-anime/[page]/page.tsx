"use client";

import { useGetCompleteAnimeQuery } from "@/redux/api/anime/anime-completed-api";
import { notFound, usePathname } from "next/navigation";
import CompletedCard from "../../_components/completed-card";
import CompletedPagination from "./components/complete-pagination";

export default function CompletedAnimeSlug() {
  const path = usePathname();
  const pathSplit = path.split("/");
  const pageCurrent = pathSplit[2];

  const { data: dataComplete, isError: errorComplete } =
    useGetCompleteAnimeQuery({ page: pageCurrent });

  if (errorComplete) {
    return <>Error fetching data...</>;
  }

  if (dataComplete?.data?.completeAnimeData.length === 0) return notFound();

  return (
    <div className="container mx-auto">
      <CompletedCard
        animeData={dataComplete?.data?.completeAnimeData}
        animeHeader={"Completed Anime"}
        seeAllLink={""}
      />

      <CompletedPagination completedData={dataComplete?.data?.paginationData} />
    </div>
  );
}
