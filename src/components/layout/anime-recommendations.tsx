import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { title } from "./primitives";

interface RecommendationsProps {
  title: string;
  slug: string;
  poster: string;
  otakudesu_url: string;
}

export default function AnimeRecommendations({
  recommendations,
}: Readonly<{ recommendations: RecommendationsProps[] }>) {
  return (
    <>
      <p className={title({ className: "text-start", size: "xl" })}>
        Recommendations
      </p>
      <div className="grid gap-4 max-[640px]:grid-cols-2 max-[400px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.slug}>
            <Link href={`/anime/${recommendation.slug}`}>
              <Image
                className="h-auto w-96 rounded-sm object-cover"
                src={recommendation.poster}
                alt={recommendation.title}
                layout="responsive"
                width={400}
                height={400}
              />
              <CardContent>
                <p className={title({ className: "mt-4" })}>
                  {recommendation.title}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
