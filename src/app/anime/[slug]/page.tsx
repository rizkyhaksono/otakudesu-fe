import BaseLayout from "@/components/base-layout"
import { Metadata } from "next"
import AnimeDetails from "@/components/anime-details"

export const metadata: Metadata = {
  title: "Anime Detail | Otakudesu",
  description: "Anime Detail Page Otakudesu. Build by Rizky Haksono",
}

export default function AnimeSlug() {
  return (
    <BaseLayout>
      <AnimeDetails />
    </BaseLayout>
  )
}
