"use client";

import { useGetComicHomeQuery } from "@/redux/api/comic/comic-home-api"
import { Card } from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";

export default function ComicHome() {
  const { data: comicData, error: comicError, isLoading } = useGetComicHomeQuery({})

  if (isLoading) return <SkeletonCard />;
  if (comicError) return <div>Error loading comics!</div>;

  const renderComics = (title: any, comics: any) => (
    <>
      <Typography.H2 className="text-center mt-10 mb-5">{title}</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {comics?.map((comic: any) => (
          <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow text-start">
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
              <Typography.P className="font-semibold">Latest Chapter:</Typography.P>
              {comic?.chapters?.slice(0, 2).map((chapter: any) => (
                <div key={chapter.title}>
                  <Typography.P className="text-gray-600">{chapter.chapter}</Typography.P>
                  <Typography.P className="text-sm text-gray-500">{chapter.time} lalu</Typography.P>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  return (
    <>
      {renderComics("Latest Comics", comicData?.data?.latestComics)}
      {renderComics("Popular Comics", comicData?.data?.popularComics)}
    </>
  )
}