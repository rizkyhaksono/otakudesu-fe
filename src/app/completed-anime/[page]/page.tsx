"use client";

import { useGetCompleteAnimeQuery } from "@/redux/api/completeanime-api";
import { usePathname } from "next/navigation";
import CompletedCard from "@/components/layout/completed-card";
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
