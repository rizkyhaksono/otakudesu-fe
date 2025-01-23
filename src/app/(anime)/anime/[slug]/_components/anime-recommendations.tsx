import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";

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
      <Typography.P className="text-start">
        Recommendations
      </Typography.P>
      <div className="mt-2 grid gap-4 max-[640px]:grid-cols-2 max-[400px]:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
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
                <Typography.P className="mt-4">
                  {recommendation.title}
                </Typography.P>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
