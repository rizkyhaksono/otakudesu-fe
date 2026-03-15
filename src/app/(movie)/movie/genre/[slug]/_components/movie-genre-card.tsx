import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "@/components/layout/skeleton-card";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import { MovieGenreItem } from "@/types/movie";

export default function MovieGenreCard({
  movieHeader,
  movieData,
}: Readonly<{ movieHeader: string | null | undefined; movieData: MovieGenreItem[] }>) {
  if (!movieData) {
    return (
      <Card className="my-5">
        <CardHeader className="text-center text-2xl font-bold">{movieHeader}</CardHeader>
        <CardContent>
          <SkeletonCard />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto mt-5">
      <CardHeader className="text-center text-2xl font-bold">{movieHeader}</CardHeader>
      <CardContent className="grid gap-2 max-[640px]:grid-cols-2 max-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {movieData.map((movie: MovieGenreItem) => (
          <Link href={`/movie/detail/${movie.slug}`} key={movie.slug}>
            <div className="h-full items-center rounded-md border transition duration-300 hover:shadow-xl dark:hover:bg-black dark:hover:shadow-black">
              <Image
                src={movie.image}
                alt={movie.title}
                className="rounded-t-lg object-cover max-[640px]:h-52 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                width={300}
                height={300}
              />
              <div className="mt-4 space-y-1 px-4 pb-4">
                <Typography.P className="text-lg font-bold">{movie.title}</Typography.P>
                <Typography.P className="text-sm">Quality: {movie.quality || "N/A"}</Typography.P>
                <Typography.P className="text-sm">
                  Rating: {movie.rating === "" ? "-" : movie.rating}
                </Typography.P>
                <Typography.P className="text-sm">Year: {movie.year}</Typography.P>
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <Typography.P>Genres:</Typography.P>
                    {movie.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </div>
  );
}
