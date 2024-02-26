import BaseLayout from "@/components/base-layout"
import { Metadata } from "next/types"
import GenreSlug from "@/components/genre-slug"

export const metadata: Metadata = {
  title: "Genre Anime | Otakudesu",
  description: "Genre Anime Page Otakudesu. Build by Rizky Haksono",
}

export default function GenrePageDetail() {
  return (
    <BaseLayout>
      <GenreSlug />
    </BaseLayout>
  )
}
