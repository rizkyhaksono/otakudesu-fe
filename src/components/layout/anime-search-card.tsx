import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { subtitle, title } from "./primitives";

export default function AnimeSearchCard({ anime }: Readonly<{ anime: any }>) {
  console.log(anime?.recommendations);

  if (!anime || anime === undefined) {
    return <div className="text-center">Anime not found!</div>;
  }

  return (
    <Card className="container mb-10" key={anime.slug}>
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

            <Link
              href={anime.batch.otakudesu_url}
              key={anime.batch.slug}
              className={title({ className: "underline underline-offset-4" })}
              target="_blank"
            >
              Download Batch Right Here
              <p className={subtitle()}>Uploaded: {anime.batch.uploaded_at}</p>
            </Link>

            <div className="my-5">
              <p className={title({ size: "lg" })}>Recommendations</p>
              <div className="grid grid-cols-5 gap-4">
                {anime?.recommendations?.map((recommendation: any) => (
                  <Card key={recommendation.slug}>
                    <Link href={`/anime/${recommendation.slug}`}>
                      <Image
                        className="rounded-t-lg object-cover"
                        src={recommendation.poster}
                        width={200}
                        height={100}
                        alt={recommendation.slug}
                      />
                      <p
                        className={title({
                          size: "sm",
                          className: "my-4 ml-4",
                        })}
                      >
                        {recommendation.title}
                      </p>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
