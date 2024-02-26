import * as React from "react"
import BaseLayout from "@/components/base-layout"
import HomeCard from "@/components/home-card"
import RandomImage from "@/components/random-image"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Home | Otakudesu",
  description: "Home Page Otakudesu. Build by Rizky Haksono",
}

export default function Home() {
  return (
    <BaseLayout>
      <RandomImage pageName={"Home"} />

      <div className="container mx-auto">
        <div className="mt-10">
          <HomeCard />
        </div>
      </div>
    </BaseLayout>
  )
}
