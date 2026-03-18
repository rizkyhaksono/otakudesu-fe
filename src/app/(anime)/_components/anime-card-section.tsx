import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";
import { ReactNode } from "react";

type BaseAnimeItem = {
  slug: string;
  title: string;
  poster: string;
};

export default function AnimeCardSection<T extends BaseAnimeItem>({
  animeHeader,
  animeData,
  seeAllLink,
  renderMeta,
}: Readonly<{
  animeData: T[] | null | undefined;
  seeAllLink: string | null | undefined;
  animeHeader: string | null | undefined;
  renderMeta: (anime: T) => ReactNode;
}>) {
  if (!animeData) {
    return (
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3 px-2">
          <span className="h-5 w-1 rounded-full bg-primary" />
          <Typography.H3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {animeHeader}
          </Typography.H3>
        </div>
        <SkeletonCard />
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-end justify-between px-2">
        <div className="flex items-end gap-3">
          <span className="h-5 w-1 rounded-full bg-primary" />
          <Typography.H3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {animeHeader}
          </Typography.H3>
        </div>
        {seeAllLink && (
          <Link
            href={`/${seeAllLink}/1`}
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            See all →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 px-2 sm:grid-cols-3 lg:grid-cols-5">
        {animeData.map((anime, index) => (
          <Link href={`/anime/${anime.slug}`} key={anime.slug} className="group h-full">
            <Card
              className="h-full overflow-hidden border-border/60 bg-card/90 text-start shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:shadow-md"
              style={{
                animationDelay: `${Math.min(index * 50, 400)}ms`,
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={anime.poster}
                  alt={anime.title}
                  className="h-36 w-full rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-[1.06] sm:h-80 md:h-72 lg:h-72 xl:h-96"
                  width={1000}
                  height={1000}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="mt-3 flex-1 space-y-1.5 px-3 pb-3">
                <Typography.P className="line-clamp-2 text-sm font-semibold leading-5 sm:text-base">
                  {anime.title}
                </Typography.P>
                <div className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                  {renderMeta(anime)}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
