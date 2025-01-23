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
      <Typography.H2 className="text-center">Latest Comics</Typography.H2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
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
                className="w-full h-48 object-cover rounded-md"
                loading="lazy"
              />
              <div className="mt-4">
                <p className="font-semibold">Latest Chapter:</p>
                <p className="text-gray-600">{comic.chapters[0].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[0].time} ago</p>
                <p className="text-gray-600">{comic.chapters[1].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[1].time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography.H2 className="text-center mt-10">Popular Comics</Typography.H2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
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
                className="w-full h-48 object-cover rounded-md"
                loading="lazy"
              />
              <div className="mt-4">
                <p className="font-semibold">Latest Chapter:</p>
                <p className="text-gray-600">{comic.chapters[0].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[0].time}</p>
                <p className="text-gray-600">{comic.chapters[1].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[1].time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography.H2 className="text-center mt-10">Mirror Comics</Typography.H2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
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
                className="w-full h-48 object-cover rounded-md"
                loading="lazy"
              />
              <div className="mt-4">
                <p className="font-semibold">Latest Chapter:</p>
                <p className="text-gray-600">{comic.chapters[0].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[0].time}</p>
                <p className="text-gray-600">{comic.chapters[1].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[1].time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}