"use client";

import { useGetComicHomeQuery } from "@/redux/api/comic/comic-home-api"
import { Card } from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";
import Link from "next/link";

export default function ComicHome() {
  const { data: comicData, error: comicError, isLoading } = useGetComicHomeQuery({})

  if (isLoading) return <SkeletonCard />;
  if (comicError) return <>Error loading comics!</>;

  return (
    <>
      <Typography.H2 className="text-center mt-10 mb-5">{"Latest Comics"}</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {comicData?.data?.latestComics.map((comic: any) => (
          <div key={comic.title}>
            <Link href={`/comic/${comic.slug}`} passHref>
              <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow text-start h-full">
                <Image
                  src={comic.image}
                  alt={comic.title}
                  width={1000}
                  height={1000}
                  className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                  loading="lazy"
                />
                <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                  <Typography.H4>{comic.title}</Typography.H4>
                  <Typography.P className="text-sm">Latest Chapter:</Typography.P>
                  {comic?.chapters?.slice(0, 2).map((chapter: any) => (
                    <div key={chapter.title} className="text-sm">
                      <Typography.P className="text-sm text-muted-foreground">{chapter.chapter}</Typography.P>
                      <Typography.P className="text-sm text-muted-foreground/40">{chapter.time} lalu</Typography.P>
                    </div>
                  ))}
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      <Typography.H2 className="text-center mt-10 mb-5">{"Popular Comics"}</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {comicData?.data?.popularComics.map((comic: any) => (
          <div key={comic.title}>
            <Link href={`/comic/${comic.slug}`} passHref target="_blank">
              <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow text-start h-full">
                <Image
                  src={comic.image}
                  alt={comic.title}
                  width={1000}
                  height={1000}
                  className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                  loading="lazy"
                />
                <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                  <Typography.H4>{comic.title}</Typography.H4>
                  <Typography.P className="text-sm text-muted-foreground">Rating: {comic.rating}</Typography.P>
                  <Typography.P className="text-sm text-muted-foreground">{comic.chapter}</Typography.P>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}