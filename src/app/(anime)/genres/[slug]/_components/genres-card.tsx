import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "@/components/layout/skeleton-card";
import { GenresAnimeProps } from "@/types/genres-anime";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";

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
    <div className="container mx-auto mt-5">
      <CardHeader className="text-center text-2xl font-bold">
        {animeHeader}
      </CardHeader>
      <CardContent className="grid gap-2 max-[640px]:grid-cols-2 max-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {animeData.map((anime: GenresAnimeProps) => (
          <Link href={`/anime/${anime.slug}`} key={anime.slug}>
            <div className="items-center rounded-md border transition duration-300 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black h-full">
              <Image
                src={anime.poster}
                alt={anime.title}
                className="rounded-t-lg object-cover max-[640px]:h-52 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                width={300}
                height={300}
              />
              <div className="mt-4 space-y-1 px-4 pb-4">
                <Typography.P className="text-lg font-bold">{anime.title}</Typography.P>
                <Typography.P className="pt-3 text-sm underline decoration-solid underline-offset-4">Total Episode {anime.episode_count}</Typography.P>
                <Typography.P className="text-sm">Rating: {anime.rating === "" ? "-" : anime.rating}</Typography.P>
                <Typography.P className="text-sm">Studio: {anime.studio}</Typography.P>
                <Typography.P className="text-sm">Season: {anime.season}</Typography.P>
                <div className="flex flex-wrap gap-1">
                  <Typography.P>Genres:</Typography.P>
                  {anime.genres.map((genre) => (
                    <Link
                      key={genre.slug}
                      href={`/genres/${genre.slug}?page=1`}
                    >
                      <Badge variant="secondary">{genre.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </div>
  );
}
