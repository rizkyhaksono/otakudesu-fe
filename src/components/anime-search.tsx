"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGetAnimeQuery } from "@/redux/api/anime-api"
import AnimeCard from "./anime-card"

export default function AnimeSearch() {
  const [search, setSearch] = useState("")
  const { data: dataAnime, isLoading: loadingAnime, error: errorAnime } = useGetAnimeQuery(search)

  return (
    <>
      <div className="flex container w-full items-center mt-10 space-x-2">
        <Input className="border-gray-600" type="text" placeholder="Search anime..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit" onClick={() => console.log("Searching for:", search)}>
          Search
        </Button>
      </div>
      <div className="mt-10 flex justify-center w-full">{dataAnime && <AnimeCard anime={dataAnime.data} />}</div>
    </>
  )
}
