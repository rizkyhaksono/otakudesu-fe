import BaseLayout from "@/components/layout/base-layout";
import AnimeSearch from "@/components/layout/anime-search";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Search Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimePage() {
  return (
    <BaseLayout>
      <AnimeSearch />
    </BaseLayout>
  );
}
