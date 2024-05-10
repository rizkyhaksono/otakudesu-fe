import { getSavedEpisode } from "@/helpers/storage-episode";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import Image from "next/image";
import Link from "next/link";

export default function LastWatched() {
  const lastWatched = getSavedEpisode();

  console.log(lastWatched);

  return (
    <Card className="grid grid-cols-5">
      {lastWatched.length > 0 ? (
        lastWatched.map((episode: any) => (
          <Link key={episode.router} href={episode.episode}>
            <CardContent>
              <Image
                src={episode.poster}
                width={100}
                height={100}
                alt="Poster Last Watched"
              />
              <CardHeader>{episode.title}</CardHeader>
            </CardContent>
          </Link>
        ))
      ) : (
        <p>No episode watched yet</p>
      )}
    </Card>
  );
}
