import { OnGoingAnimeProps } from "@/types/ongoing-anime";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "./skeleton-card";

export default function OngoingCard({
  animeHeader,
  animeData,
  seeAllLink,
}: Readonly<{
  animeData: OnGoingAnimeProps[];
  seeAllLink: string | null | undefined;
  animeHeader: string | null | undefined;
}>) {
  if (!animeData) {
    return (
      <Card>
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
    <Card>
      <CardHeader className="text-center text-2xl font-bold">
        {animeHeader}
      </CardHeader>
      <CardContent className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {animeData?.map((anime: OnGoingAnimeProps) => (
          <Link href={`/anime/${anime.slug}`} key={anime.slug}>
            <div className="items-center rounded-md border transition duration-300 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black">
              <Image
                src={anime.poster}
                alt={anime.title}
                className="rounded object-cover max-[640px]:h-52 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                width={300}
                height={300}
              />
              <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                <p className="text-xl font-bold leading-none max-[766px]:text-lg">
                  {anime.title}
                </p>
                <p className="pt-5 text-sm text-muted-foreground">
                  Current Episode: {anime.current_episode}
                </p>
                <p className="text-sm text-muted-foreground">
                  Release Day: {anime.release_day}
                </p>
                <p className="text-sm text-muted-foreground">
                  Release Date: {anime.newest_release_date}
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
