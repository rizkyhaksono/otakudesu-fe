import BaseLayout from "@/components/layout/base-layout";
import { Metadata } from "next";
import AnimeEpisode from "@/app/anime/[slug]/episodes/[episodes]/components/anime-episode";

export const metadata: Metadata = {
  title: "Watch Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimeSlugEpisode() {
  return (
    <BaseLayout>
      <AnimeEpisode />
    </BaseLayout>
  );
}
