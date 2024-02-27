import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import AnimeCardProps from "@/types/anime";
import Link from "next/link";

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  if (!anime) {
    return <div>Anime not found!</div>;
  }

  return (
    <Card className="container mx-3">
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
        <p>{anime.synopsis}</p>
        <div className="my-5">
          <p className="text-lg font-semibold">Episode Lists:</p>
          <ul className="mt-5">
            {anime.episode_lists.map((episode) => (
              <li key={episode.slug}>
                <Link href={`/anime/${episode.slug}`}>
                  <p>{episode.episode}</p>
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
};

export default AnimeCard;
