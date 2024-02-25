"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useGetEpisodeQuery } from "@/redux/api/episode-api"
import { useGetAnimeQuery } from "@/redux/api/anime-api"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Skeleton from "@/components/skeleton"

export default function AnimeDetails() {
  const router = useParams()
  // const { data: dataEpisodeAnime } = useGetEpisodeQuery({ slug: router.slug, episode: 1 })
  const { data: dataAnime, error: errorAnime, isLoading: loadingAnime } = useGetAnimeQuery("rag-crimson-sub-indo")

  if (loadingAnime) {
    return <Skeleton />
  }

  if (errorAnime) {
    return <>Error fetching data...</>
  }

  return (
    <>
      {dataAnime && dataAnime.data && (
        <div key={dataAnime.data.title}>
          {dataAnime.data.map((data: any) => (
            <Card key={data.slug}>
              <CardHeader>{data.title}</CardHeader>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
