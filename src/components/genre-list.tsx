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

  return (
    <>
      {dataGenres && dataGenres.data && (
        <div className="container mx-auto grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 max-[640px]:grid-cols-2 gap-2">
          {dataGenres.data.map((genre: any) => (
            <>
              <Link href={`/genres/${genre.slug}?page=1`}>
                <Card key={genre.slug} className="text-center text-foreground dark:hover:bg-black dark:hover:shadow-black hover:shadow-xl transition duration-300 hover:translate-y-2">
                  <CardHeader>
                    <CardTitle className="xl:text-xl lg:text-xl md:text-lg sm:text-lg max-[640px]:text-base">{genre.name}</CardTitle>
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
