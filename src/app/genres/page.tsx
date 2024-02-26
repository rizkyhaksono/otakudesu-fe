import BaseLayout from "@/components/base-layout"
import RandomImage from "@/components/random-image"
import GenresList from "@/components/genre-list"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Genres | Otakudesu",
  description: "Genres Page Otakudesu. Build by Rizky Haksono",
}

export default function GenrePage() {
  return (
    <>
      <BaseLayout>
        <RandomImage pageName={"Genres"} />

        <div className="container mx-auto">
          <div className="mt-10">
            <GenresList />
          </div>
        </div>
      </BaseLayout>
    </>
  )
}
