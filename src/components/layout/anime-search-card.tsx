import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function AnimeSearchCard({ anime }: any) {
  if (!anime) {
    return <div className="text-center">Anime not found!</div>;
  }

  return (
    <Card className="container mx-auto mb-10">
      <CardHeader>
        <CardTitle>{anime.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-[640px]:grid-cols-1 md:flex lg:flex xl:flex">
          <Image
            className="h-96 w-96 rounded-xl object-cover"
            width={200}
            height={400}
            src={anime.poster}
            alt={anime.title}
          />
          <div className="max-[766px]:my-5 min-[766px]:ml-10">
            <p>{anime.synopsis}</p>
            <div className="my-5">
              <p>Japanese Title: {anime.japanese_title}</p>
              <p>Rating: {anime.rating}</p>
              <p>Producer: {anime.produser}</p>
              <p>Type: {anime.type}</p>
              <p>Status: {anime.status}</p>
              <p>Total Episodes: {anime.episode_count}</p>
              <p>Avg. Durations: {anime.duration}</p>
              <p>Release Date: {anime.release_date}</p>
              <p>Studio: {anime.studio}</p>
              <ul className="mt-5">
                {anime?.episode_lists.map((episode: any) => (
                  <li key={episode.slug}>
                    <Link href={`/anime/${episode.slug}`}>
                      <p className="mt-2 w-full rounded-xl bg-gray-100 px-5 py-3 text-base font-normal duration-300 hover:bg-gray-200 dark:bg-[#1f2022] hover:dark:bg-white/10">
                        {episode.episode}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p>Batch: {anime.batch}</p>
          </div>
        </div>
        <p className="mb-2 mt-10 text-2xl font-semibold">Recommendations</p>
        <div className="grid gap-3 max-[766px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {anime.recommendations.map((rec: any) => (
            <Card
              className="cursor-pointer object-cover transition duration-300 hover:scale-105"
              key={rec.slug}
            >
              <Link href={`/anime/${rec.slug}`}>
                <Image
                  className="h-auto w-full rounded-sm object-cover"
                  width={400}
                  height={400}
                  src={rec.poster}
                  alt={rec.title}
                />
                <CardContent>
                  <p className="text-md mt-5 text-center font-semibold">
                    {rec.title}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
