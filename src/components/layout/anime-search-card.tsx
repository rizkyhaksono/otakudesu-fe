import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function AnimeSearchCard({ anime }: any) {
  if (!anime) {
    return <div>Anime not found!</div>;
  }

  return (
    <Card className="container mx-10 mb-10">
      <CardHeader>
        <CardTitle>{anime.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          className="rounded-lg"
          width={200}
          height={400}
          src={anime.poster}
          alt={anime.title}
        />
        <p className="mt-10">{anime.synopsis}</p>
        <div className="my-5">
          <p>Rating: {anime.rating}</p>
          <p className="text-lg font-semibold">Episode Lists:</p>
          <ul className="mt-5">
            {anime.episode_lists.map((episode: any) => (
              <li key={episode.slug}>
                <Link href={`/anime/${episode.slug}`}>
                  <p className="mt-2 w-full rounded-xl bg-gray-100 px-5 py-3 text-base font-normal duration-300 hover:bg-gray-200 dark:bg-black hover:dark:bg-white/10">
                    {episode.episode}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <p>Rating: {anime.rating}</p>
      </CardFooter>
    </Card>
  );
}
