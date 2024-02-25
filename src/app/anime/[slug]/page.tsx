import BaseLayout from "@/components/base-layout"
import { Metadata } from "next"
import AnimeDetails from "@/components/anime-details"

export const metadata: Metadata = {
  title: "Slug | Otakudesu",
  description: "Anime Slug Page Otakudesu. Build by Rizky Haksono",
}

export default function AnimeSlug() {
  return (
    <BaseLayout>
      <AnimeDetails
        anime={{
          title: "",
          japanese_title: "",
          producer: "",
          type: "",
          status: "",
          episode_count: "",
          duration: "",
          release_date: "",
          studio: "",
          poster: "",
          synopsis: "",
          rating: "",
          genres: [],
          episode_lists: [],
          recommendation: [],
        }}
      />
    </BaseLayout>
  )
}
