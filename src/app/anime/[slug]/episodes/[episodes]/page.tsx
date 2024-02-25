"use client"

import { useParams } from "next/navigation"

export default function AnimeEpisode() {
  const router = useParams<{ slug: string; episodes: string }>()

  console.log(router)

  return (
    <>
      <div>{router.slug}</div>
      <div className="mt-1">{router.episodes}</div>
    </>
  )
}
