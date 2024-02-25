"use client"

import { useGetGenresQuery } from "@/redux/api/genre-api"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Skeleton from "./skeleton"
import Link from "next/link"

export default function GenresList() {
  const { data: dataGenres, error: errorGenres, isLoading: loadingGenres } = useGetGenresQuery(arguments)

  if (loadingGenres) {
    return <Skeleton />
  }

  if (errorGenres) {
    return <>Error fetching data...</>
  }

  const handleCardClick = (slug: any) => {
    console.log("Clicked on genre with slug:", slug)
  }

  return (
    <>
      {dataGenres && dataGenres.data && (
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 max-[640px] gap-2">
          {dataGenres.data.map((genre: any) => (
            <>
              <Link href={`/genres/${genre.slug}`}>
                <Card key={genre.slug} className="text-center text-foreground dark:hover:bg-black hover:shadow-lg dark:hover:shadow-black shadow-xl transition duration-400" onClick={() => handleCardClick(genre)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{genre.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </>
          ))}
        </div>
      )}
    </>
  )
}
