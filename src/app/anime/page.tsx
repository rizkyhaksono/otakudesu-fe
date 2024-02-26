import BaseLayout from "@/components/base-layout"
import AnimeSearch from "@/components/anime-search"
import { Metadata } from "next/types"
import RandomImage from "@/components/random-image"

export const metadata: Metadata = {
  title: "Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
}

export default function AnimePage() {
  return (
    <>
      <BaseLayout>
        {/* <RandomImage pageName={"Search Anime"} /> */}
        <AnimeSearch />
      </BaseLayout>
    </>
  )
}
