import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <CardHeader className="items-center text-center">
          <Typography.H3 className="text-3xl tracking-wide text-foreground">
            {animeHeader}
          </Typography.H3>
        </CardHeader>
        <SkeletonCard />
      </section>
    );
  }

  return (
    <section className="mb-12">
      <CardHeader className="items-center text-center">
        <Typography.H3 className="inline-flex items-center text-4xl tracking-wide text-foreground">
          {animeHeader}
        </Typography.H3>
        <span className="mt-3 h-1 w-24 rounded-full bg-primary" />
      </CardHeader>

      <div className="mx-2 grid gap-4 max-[640px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
                  className="rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-[1.06] max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                  width={1000}
                  height={1000}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="mt-4 flex-1 space-y-2 px-4 pb-4">
                <Typography.P className="line-clamp-2 text-base font-semibold leading-6 sm:text-lg">
                  {anime.title}
                </Typography.P>
                <div className="space-y-1 text-sm text-muted-foreground">{renderMeta(anime)}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {seeAllLink && (
        <CardFooter className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            className="transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Link href={`/${seeAllLink}/1`}>See all</Link>
          </Button>
        </CardFooter>
      )}
    </section>
  );
}
