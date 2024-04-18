import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { title, subtitle } from "@/components/layout/primitives";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "@/components/layout/skeleton-card";
import { GenresAnimeProps } from "@/types/genres-anime";

export default function GenresCard({
  animeHeader,
  animeData,
}: Readonly<{
  animeHeader: string | null | undefined;
  animeData: GenresAnimeProps[];
}>) {
  if (!animeData) {
    return (
      <Card className="my-5">
        <CardHeader className="text-center text-2xl font-bold">
          {animeHeader}
        </CardHeader>
        <CardContent>
          <SkeletonCard />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="container mx-auto mt-5">
      <CardHeader className="text-center text-2xl font-bold">
        {animeHeader}
      </CardHeader>
      <CardContent className="grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {animeData.map((anime: GenresAnimeProps) => (
          <Link href={`/anime/${anime.slug}`} key={anime.slug}>
            <div className="items-center rounded-md border transition duration-300 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black">
              <Image
                src={anime.poster}
                alt={anime.title}
                className="rounded-t-lg object-cover max-[640px]:h-52 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                width={300}
                height={300}
              />
              <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                <p className={title()}>{anime.title}</p>
                <p
                  className={subtitle({
                    className:
                      "pt-3 underline decoration-solid underline-offset-4",
                  })}
                >
                  Total Episode {anime.episode_count}
                </p>
                <p className={subtitle()}>
                  Rating: {anime.rating === "" ? "-" : anime.rating}
                </p>
                <p className={subtitle()}>Studio: {anime.studio}</p>
                <p className={subtitle()}>Season: {anime.season}</p>
                <div className="flex items-start gap-2">
                  <p className={subtitle()}>Genres:</p>
                  <ul className="flex flex-wrap items-start">
                    {anime.genres.map((genre) => (
                      <li key={genre.slug} className="mb-2 mr-1">
                        <Link
                          href={`/genres/${genre.slug}?page=1`}
                          className={subtitle({
                            className:
                              "rounded-lg bg-gray-200/50 px-2 py-0.5 duration-300 hover:bg-gray-200/80 dark:bg-gray-200/10 hover:dark:bg-gray-200/20",
                          })}
                        >
                          {genre.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
