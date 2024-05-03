import { CompletedAnimeProps } from "@/types/completed-anime";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { title, subtitle } from "./primitives";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "./skeleton-card";

export default function CompletedCard({
  animeHeader,
  animeData,
  seeAllLink,
}: Readonly<{
  animeData: CompletedAnimeProps[];
  seeAllLink: string | null | undefined;
  animeHeader: string | null | undefined;
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
    <Card className="my-5">
      <CardHeader className="text-center text-2xl font-bold">
        {animeHeader}
      </CardHeader>
      <CardContent className="mx-2 grid gap-2 max-[640px]:grid-cols-2 max-[400px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {animeData?.map((anime: CompletedAnimeProps) => (
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
                <p className={subtitle()}>Rating: {anime.rating}</p>
                <p className={subtitle()}>
                  Last Release Date: {anime.last_release_date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>

      {seeAllLink && (
        <CardFooter className="mt-2 flex justify-end">
          <Link
            className="text-base duration-300 hover:scale-105 hover:underline"
            href={`/${seeAllLink}/1`}
          >
            See all
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
