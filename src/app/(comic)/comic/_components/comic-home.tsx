"use client";

import { useGetComicHomeQuery } from "@/redux/api/comic/comic-home-api";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import SharedHeroCarousel, { HeroCarouselItem } from "@/components/layout/shared-hero-carousel";

export default function ComicHome() {
  const { data: comicData, error: comicError, isLoading } = useGetComicHomeQuery({});

  if (isLoading) return <SkeletonCard />;
  if (comicError) return <>Error loading comics!</>;

  const heroItems: HeroCarouselItem[] =
    comicData?.data?.latestComics?.slice(0, 5).map((comic: any) => ({
      id: comic.slug,
      title: comic.title,
      image: comic.image,
      url: `/comic/${comic.slug}`,
      badge: "Latest Release",
      tags: comic.chapters?.slice(0, 1).map((ch: any) => ch.chapter) || [],
      description:
        "Read the latest exciting manga, manhwa, and manhua straight from the creators. Stay tuned for fast translations and high-quality scans.",
      primaryButtonText: "Read Now",
      secondaryButtonText: "Info",
    })) || [];

  return (
    <div className="mb-10 flex w-full flex-col">
      {heroItems.length > 0 && <SharedHeroCarousel items={heroItems} />}
      <div className="container mx-auto mt-10 space-y-6 px-4">
        <Typography.H2 className="mb-5 mt-10 text-center">{"Latest Comics"}</Typography.H2>
        <div className="mx-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {comicData?.data?.latestComics.map((comic: any) => (
            <div key={comic.title}>
              <Link href={`/comic/${comic.slug}`}>
                <Card
                  key={comic.title}
                  className="h-full text-start shadow-lg transition-shadow hover:shadow-xl"
                >
                  <Image
                    src={comic.image}
                    alt={comic.title}
                    width={1000}
                    height={1000}
                    className="h-36 w-full rounded-t-lg object-cover sm:h-80 md:h-72 lg:h-72 xl:h-96"
                    loading="lazy"
                  />
                  <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                    <Typography.H4>{comic.title}</Typography.H4>
                    <Typography.P className="text-sm">Latest Chapter:</Typography.P>
                    {comic?.chapters?.slice(0, 2).map((chapter: any) => (
                      <div key={chapter.title} className="text-sm">
                        <Typography.P className="text-sm text-muted-foreground">
                          {chapter.chapter}
                        </Typography.P>
                        <Typography.P className="text-sm text-muted-foreground/40">
                          {chapter.time} lalu
                        </Typography.P>
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <Typography.H2 className="mb-5 mt-10 text-center">{"Popular Comics"}</Typography.H2>
        <div className="mx-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {comicData?.data?.popularComics.map((comic: any) => (
            <div key={comic.title}>
              <Link href={`/comic/${comic.slug}`} target="_blank">
                <Card
                  key={comic.title}
                  className="h-full text-start shadow-lg transition-shadow hover:shadow-xl"
                >
                  <Image
                    src={comic.image}
                    alt={comic.title}
                    width={1000}
                    height={1000}
                    className="h-36 w-full rounded-t-lg object-cover sm:h-80 md:h-72 lg:h-72 xl:h-96"
                    loading="lazy"
                  />
                  <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                    <Typography.H4>{comic.title}</Typography.H4>
                    <Typography.P className="text-sm text-muted-foreground">
                      Rating: {comic.rating}
                    </Typography.P>
                    <Typography.P className="text-sm text-muted-foreground">
                      {comic.chapter}
                    </Typography.P>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
