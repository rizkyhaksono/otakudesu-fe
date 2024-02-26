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
        <div className="container px-4 py-10 mx-auto sm:max-w-xl max-[640px]:text-center md:max-w-full lg:max-w-screen-xl md:px-24">
          <div className="max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
            <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
              Discover Your
              <span className="text-transparent bg-clip-text leading-12 bg-gradient-to-r from-yellow-400 to-purple-500"> Anime Genres</span>
            </h2>
            <p className="mb-6 text-base text-foreground md:text-lg">
              Explore the vast realm of anime genres, be it the excitement of action, the magical allure of fantasy, the heartwarming embrace of romance, or the delightful charm of slice-of-life. Your anime journey commences wherever your
              passions lead!
            </p>
          </div>
        </div>
        <GenresList />
      </BaseLayout>
    </>
  )
}
