"use client";

import Image from "next/image";
import { useGetMovieBoxDetailQuery } from "@/redux/api/movie/moviebox-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import SkeletonCard from "@/components/layout/skeleton-card";
import MovieBoxPlayer from "./moviebox-player";
import { MovieBoxStaff } from "@/types/movie";

export default function MovieBoxDetailCard({ subjectId }: Readonly<{ subjectId: string }>) {
  const { data, error, isLoading } = useGetMovieBoxDetailQuery(subjectId);

  if (isLoading) return <SkeletonCard />;
  if (error) return <div>Error loading movie details</div>;
  if (!data) return null;

  const { subject, stars, resource } = data;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{subject.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-[640px]:grid-cols-1 md:flex lg:flex xl:flex">
            <Image
              className="h-96 w-96 rounded-xl object-cover"
              width={1000}
              height={1000}
              src={subject.cover.url}
              alt={subject.title}
            />
            <div className="max-[766px]:my-5 min-[766px]:ml-10">
              <Typography.P className="font-normal">
                {subject.description || "No description available."}
              </Typography.P>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <Typography.P>IMDB Rating: {subject.imdbRatingValue || "N/A"}</Typography.P>
                <Typography.P>Duration: {subject.duration} minutes</Typography.P>
                <Typography.P>Country: {subject.countryName}</Typography.P>
                <Typography.P>Release: {subject.releaseDate}</Typography.P>
                <div className="col-span-2 mt-1">
                  Genre:{" "}
                  <Badge variant="secondary" className="ml-1">
                    {subject.genre}
                  </Badge>
                </div>
                <div className="col-span-2 mt-1">
                  Source:{" "}
                  <Badge variant="outline" className="ml-1">
                    {resource.source}
                  </Badge>
                </div>
                {resource.uploadBy && (
                  <div className="col-span-2">
                    Uploaded by: <span className="font-semibold">{resource.uploadBy}</span>
                  </div>
                )}
              </div>

              {stars && stars.length > 0 && (
                <div className="mt-4">
                  <Typography.P className="font-semibold">Cast:</Typography.P>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stars.map((star: MovieBoxStaff) => (
                      <div key={star.staffId} className="flex items-center gap-2">
                        {star.avatarUrl && (
                          <Image
                            src={star.avatarUrl}
                            alt={star.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <Typography.P className="text-sm font-medium">{star.name}</Typography.P>
                          <Typography.P className="text-xs text-muted-foreground">
                            {star.character}
                          </Typography.P>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {subject.hasResource && <MovieBoxPlayer subjectId={subject.subjectId} />}
        </CardContent>
      </Card>
    </div>
  );
}
