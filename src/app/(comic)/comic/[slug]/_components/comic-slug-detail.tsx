"use client";

import { useGetComicDetailQuery } from "@/redux/api/comic/comic-detail-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound, usePathname } from "next/navigation";

export default function ComicSlugDetail() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: comicData, error: comicError, isLoading } = useGetComicDetailQuery(slug as string);

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (comicError) {
    return <>Error fetching data...</>;
  }

  if (comicData?.data === undefined) return notFound();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{comicData?.data?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 md:flex-row md:gap-6">
            <Image
              className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96 md:w-72 lg:w-80"
              width={1000}
              height={1000}
              src={comicData?.data?.image}
              alt={comicData?.data?.title}
              sizes="(max-width: 767px) 100vw, (max-width: 1024px) 320px, 384px"
            />
            <div className="md:flex-1">
              <Typography.P className="font-normal">
                {comicData?.data?.description || "Sinopsis belum ada."}
              </Typography.P>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-2">
                <Typography.P>Alternative Title: {comicData?.data?.altTitle}</Typography.P>
                <Typography.P>Status: {comicData?.data?.status}</Typography.P>
                <Typography.P>Artist: {comicData?.data?.artist}</Typography.P>
                <Typography.P>Type: {comicData?.data?.type}</Typography.P>
                <Typography.P>Latest {comicData?.data?.latestChapter}</Typography.P>
                <Typography.P>Released: {comicData?.data?.released}</Typography.P>
                <Typography.P>Posted on: {comicData?.data?.postedOn}</Typography.P>
                <Typography.P>Updated on: {comicData?.data?.updatedOn}</Typography.P>
                <div className="mt-1">
                  Genres:{" "}
                  <span className="font-semibold">
                    {comicData?.data?.genres.map((genre: any) => (
                      <Badge key={genre} variant="secondary" className="mr-1 mt-1">
                        {genre}
                      </Badge>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {comicData?.data?.chapters.map((chapter: any) => (
              <Link key={chapter.slug} href={`/comic/chapter/${chapter.slug}`} target="_blank">
                <Button variant={"outline"} className="w-full justify-start">
                  <Typography.P className="text-sm">{chapter.number}</Typography.P>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
