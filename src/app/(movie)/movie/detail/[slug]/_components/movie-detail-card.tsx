"use client";

import Image from "next/image";
import { useGetMovieDetailQuery } from "@/redux/api/movie/movie-detail-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
          <div className="max-[640px]:grid-cols-1 md:flex lg:flex xl:flex">
            <Image
              className="h-96 w-96 rounded-xl object-cover"
              width={1000}
              height={1000}
              src={data?.data?.poster}
              alt={data?.data?.title}
            />
            <div className="max-[766px]:my-5 min-[766px]:ml-10">
              <Typography.P className="font-normal">
                {data?.data?.description || "Sinopsis belum ada."}
              </Typography.P>
              <Separator className="my-2" />
              <div className="text-sm text-muted-foreground grid grid-cols-2">
                <Typography.P>
                  Rating: {data?.data?.ratingValue}
                </Typography.P>
                <Typography.P>
                  Rating Bar: {data?.data?.ratingbar}
                </Typography.P>
                <Typography.P>
                  Rating Count: {data?.data?.ratingCount}
                </Typography.P>
                <Typography.P>
                  Quality: {data?.data?.quality}
                </Typography.P>
                <Typography.P>
                  Director: {data?.data?.director}
                </Typography.P>
                <Typography.P>
                  Year: {data?.data?.year}
                </Typography.P>
                <Typography.P>
                  Updated: {data?.data?.update}
                </Typography.P>
                <Typography.P>
                  Country: {data?.data?.country}
                </Typography.P>
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
            style={{ border: 'none' }}
            allowFullScreen
            className="h-[200px] w-full rounded-xl sm:h-[300px] sm:w-full md:h-[400px] md:w-full lg:h-[500px] lg:w-full xl:h-[600px] xl:w-full mt-5"
          />
        </CardContent>
      </Card>
    </div>
  );
}
