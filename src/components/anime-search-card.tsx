import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { AnimeCardProps } from "@/types/anime-card";
import Link from "next/link";

export default function AnimeCard({ anime }: { anime: AnimeCardProps }) {
  if (!anime) {
    return <div>Anime not found!</div>;
  }

  return (
    <Card className="container mx-3">
      <CardHeader>
        <CardTitle>{anime.data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          className="rounded-lg"
          width={200}
          height={400}
          src={anime.data.poster}
          alt={anime.data.title}
        />
        <p>{anime.data.synopsis}</p>
        <div className="my-5">
          <p className="text-lg font-semibold">Episode Lists:</p>
          <ul className="mt-5">
            {anime.data.episode_lists.map((episode) => (
              <li key={episode.slug}>
                <Link href={`/anime/${episode.slug}`}>
                  <a>{episode.episode}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <p>Rating: {anime.data.rating}</p>
      </CardFooter>
    </Card>
  );
}
