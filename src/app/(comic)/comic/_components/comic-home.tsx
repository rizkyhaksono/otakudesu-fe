"use client";

import { useGetComicHomeQuery } from "@/redux/api/comic/comic-home-api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";

export default function ComicHome() {
  const { data: comicData, error: comicError, isLoading } = useGetComicHomeQuery({})

  if (isLoading) return <SkeletonCard />;
  if (comicError) return <div>Error loading comics!</div>;

  return (
    <>
      <Typography.H2 className="text-center mb-5">Latest Comics</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {comicData?.data?.latestComics.map((comic: any) => (
          <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow text-start">
            <CardHeader>
              <CardTitle>{comic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={comic.image}
                alt={comic.title}
                width={500}
                height={500}
                className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                loading="lazy"
              />
              <div className="mt-4">
                <Typography.P className="font-semibold">Latest Chapter:</Typography.P>
                <Typography.P>{comic.chapters[0].title}</Typography.P>
                <Typography.P>{comic.chapters[0].time} ago</Typography.P>
                <Typography.P>{comic.chapters[1].title}</Typography.P>
                <Typography.P>{comic.chapters[1].time}</Typography.P>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography.H2 className="text-center mt-10 mb-5">Popular Comics</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {comicData?.data?.popularComics.map((comic: any) => (
          <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow text-start">
            <CardHeader>
              <CardTitle>{comic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={comic.image}
                alt={comic.title}
                width={500}
                height={500}
                className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                loading="lazy"
              />
              <div className="mt-4">
                <Typography.P className="font-semibold">Latest Chapter:</Typography.P>
                <Typography.P className="text-gray-600">{comic.chapters[0].title}</Typography.P>
                <Typography.P className="text-sm text-gray-500">{comic.chapters[0].time}</Typography.P>
                <Typography.P className="text-gray-600">{comic.chapters[1].title}</Typography.P>
                <Typography.P className="text-sm text-gray-500">{comic.chapters[1].time}</Typography.P>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography.H2 className="text-center mt-10 mb-5">Mirror Comics</Typography.H2>
      <div className="mx-2 grid gap-2 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {comicData?.data?.mirrorComics.map((comic: any) => (
          <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow text-start">
            <CardHeader>
              <CardTitle>{comic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={comic.image}
                alt={comic.title}
                width={500}
                height={500}
                className="rounded-t-lg object-cover max-[640px]:h-36 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-full lg:h-72 lg:w-full xl:h-96 xl:w-full"
                loading="lazy"
              />
              <div className="mt-4">
                <Typography.P className="font-semibold">Latest Chapter:</Typography.P>
                <Typography.P className="text-gray-600">{comic.chapters[0].title}</Typography.P>
                <Typography.P className="text-sm text-gray-500">{comic.chapters[0].time}</Typography.P>
                <Typography.P className="text-gray-600">{comic.chapters[1].title}</Typography.P>
                <Typography.P className="text-sm text-gray-500">{comic.chapters[1].time}</Typography.P>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}