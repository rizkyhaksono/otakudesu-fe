import BaseLayout from "@/components/base-layout";
import { Metadata } from "next";
import AnimeEpisode from "@/components/anime-episode";

export const metadata: Metadata = {
  title: "Watch Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimeSlugEpisode() {
  return (
    <>
      <BaseLayout>
        <AnimeEpisode />
      </BaseLayout>
    </>
  );
}
