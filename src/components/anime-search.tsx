"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGetAnimeQuery } from "@/redux/api/anime-api"
import AnimeCard from "./anime-card"

export default function AnimeSearch() {
  const [search, setSearch] = useState("")
  const { data: dataAnime } = useGetAnimeQuery(search)

  return (
    <>
      <div className="container mx-auto">
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
            <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
              Discover Your
              <span className="text-transparent bg-clip-text leading-12 bg-gradient-to-r from-orange-400 to-red-500"> Anime Journey</span>
            </h2>
            <p className="mb-6 text-base text-foreground md:text-lg">
              {"Uncover anime wonders in your favorite genres, whether it's the thrill of action, the enchantment of fantasy, the warmth of romance, or the charm of slice-of-life. Your anime adventure starts where your heart desires!"}
            </p>
            <div className="flex max-[640px]:flex-wrap gap-2 mt-10">
              <Input className="border-gray-600" type="text" placeholder="Search anime..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button className="max-[640px]:w-full" type="submit" onClick={() => console.log("Searching for:", search)}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center w-full">{dataAnime && <AnimeCard anime={dataAnime.data} />}</div>
    </>
  )
}
