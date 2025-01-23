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
  console.log(comicData);

  if (isLoading) return <SkeletonCard />;
  if (comicError) return <div>Error loading comics!</div>;

  return (
    <>
      <Typography.H2 className="text-center">Latest Comics</Typography.H2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {comicData?.data?.latestComics.map((comic: any) => (
          <Card key={comic.title} className="shadow-lg hover:shadow-xl transition-shadow">
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
              />
              <div className="mt-4">
                <p className="font-semibold">Latest Chapter:</p>
                <p className="text-gray-600">{comic.chapters[0].title}</p>
                <p className="text-sm text-gray-500">{comic.chapters[0].time} ago</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Typography.H2 className="text-center">Latest Comics</Typography.H2>
    </>
  )
}