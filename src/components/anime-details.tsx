"use client"

import { useParams } from "next/navigation"
import { useGetAnimeQuery } from "@/redux/api/anime-api"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Skeleton from "@/components/skeleton"
import AnimeCardProps from "@/types/anime"
import Image from "next/image"
import React from "react"
import Link from "next/link"

const AnimeDetails: React.FC<AnimeCardProps> = () => {
  const router = useParams()
  const { data: dataAnime, error: errorAnime, isLoading: loadingAnime } = useGetAnimeQuery(router.slug)

  if (loadingAnime) {
    return <Skeleton />
  }

  if (errorAnime) {
    return <>Error fetching data...</>
  }

  return (
    <>
      {dataAnime && (
        <Card className="container mx-auto mt-10">
          <CardHeader>
            <Image className="rounded-xl" width={400} height={400} src={dataAnime.data.poster} alt={dataAnime.data.title} />
          </CardHeader>
          <CardContent>
            <CardTitle>{dataAnime.data.title}</CardTitle>
            <p className="my-5">{dataAnime.data.synopsis}</p>
            <p>Rating: {dataAnime.data.rating}</p>
            <p>Type: {dataAnime.data.type}</p>
            <p>Status: {dataAnime.data.status}</p>
            <ul className="mt-5">
              {dataAnime.data.episode_lists.map((episode: any, index: number) => (
                <li key={episode.slug}>
                  <Link href={`/anime/${episode.slug}/episodes/${index + 1}`}>
                    <p>{episode.episode}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      )}
    </>
  )
}

export default AnimeDetails
