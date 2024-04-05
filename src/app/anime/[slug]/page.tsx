import BaseLayout from "@/components/layout/base-layout";
import { Metadata } from "next";
import AnimeDetails from "@/components/layout/anime-details";

export const metadata: Metadata = {
  title: "Anime Detail | Otakudesu",
  description: "Anime Detail Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimeSlug() {
  return (
    <BaseLayout>
      <AnimeDetails />
    </BaseLayout>
  );
}
