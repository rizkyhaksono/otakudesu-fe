import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
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
      <div className="mb-4 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-primary" />
        <Typography.P className="text-base font-semibold text-foreground">
          Recommendations
        </Typography.P>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {recommendations.map((recommendation) => (
          <Link
            key={recommendation.slug}
            href={`/anime/${recommendation.slug}`}
            className="group h-full"
          >
            <Card className="h-full overflow-hidden border-border/60 bg-card/90 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:shadow-md">
              <div className="relative overflow-hidden">
                <Image
                  className="h-36 w-full rounded-t-sm object-cover transition-transform duration-500 group-hover:scale-[1.06] sm:h-52 md:h-48 lg:h-52"
                  src={recommendation.poster}
                  alt={recommendation.title}
                  width={300}
                  height={400}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="px-3 py-2">
                <p className="line-clamp-2 text-xs font-medium leading-5 sm:text-sm">
                  {recommendation.title}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
