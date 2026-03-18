"use client";

import Image from "next/image";
import { useGetMovieDetailQuery } from "@/redux/api/movie/movie-detail-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import SkeletonCard from "@/components/layout/skeleton-card";

export default function MovieDetailCard({ slug }: Readonly<{ slug: string }>) {
  const { data, error, isLoading } = useGetMovieDetailQuery(slug);

  if (isLoading) return <SkeletonCard />;
  if (error) return <div>Error loading movie details</div>;
  if (!data) return null;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{data?.data?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5 md:flex-row md:gap-6">
            <Image
              className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96 md:w-72 lg:w-80"
              width={1000}
              height={1000}
              src={data?.data?.poster}
              alt={data?.data?.title}
              sizes="(max-width: 767px) 100vw, (max-width: 1024px) 320px, 384px"
            />
            <div className="md:flex-1">
              <Typography.P className="font-normal">
                {data?.data?.description || "Sinopsis belum ada."}
              </Typography.P>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-2">
                <Typography.P>Rating: {data?.data?.ratingValue}</Typography.P>
                <Typography.P>Rating Bar: {data?.data?.ratingbar}</Typography.P>
                <Typography.P>Rating Count: {data?.data?.ratingCount}</Typography.P>
                <Typography.P>Quality: {data?.data?.quality}</Typography.P>
                <Typography.P>Director: {data?.data?.director}</Typography.P>
                <Typography.P>Year: {data?.data?.year}</Typography.P>
                <Typography.P>Updated: {data?.data?.update}</Typography.P>
                <Typography.P>Country: {data?.data?.country}</Typography.P>
                <div className="mt-1">
                  Genres:{" "}
                  <span className="font-semibold">
                    {data?.data?.genres.map((genre: any) => (
                      <Badge key={genre} variant="secondary" className="mr-1 mt-1">
                        {genre}
                      </Badge>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <iframe
            src={data?.data?.streaming}
            title={`Streaming player for ${data?.data?.title}`}
            style={{ border: "none" }}
            allowFullScreen
            className="mt-5 h-[200px] w-full rounded-xl sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
