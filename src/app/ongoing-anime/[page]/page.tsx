import BaseLayout from "@/components/base-layout"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Ongoing Anime | Otakudesu",
  description: "Ongoing Anime Page Otakudesu. Build by Rizky Haksono",
}

export default function OngoingAnimeSlug() {
  return (
    <BaseLayout>
      <div>Ongoing Anime [Page]</div>
    </BaseLayout>
  )
}
