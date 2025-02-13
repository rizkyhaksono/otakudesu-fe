"use client";

import { useGetMovieDetailQuery } from "@/redux/api/movie/movie-detail-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlayCircle, Star } from "lucide-react";
import Image from "next/image";

export default function MovieDetailCard({ slug }: { slug: string }) {
  const { data, error, isLoading } = useGetMovieDetailQuery(slug);

  if (isLoading) return <div aria-busy="true">Loading...</div>;
  if (error) return <div>Error loading movie details</div>;
  if (!data) return null;

  // Sanitize movie title
  const cleanTitle = data.title.split("asda")[0];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Poster Section */}
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={data.poster || "/fallback-image.jpg"} // Fallback image if poster is missing
              alt={cleanTitle}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{cleanTitle}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{data.ratingValue || "N/A"}/10</span>
              {data.ratingCount && (
                <span className="text-muted-foreground">
                  ({data.ratingCount} votes)
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {data.genres?.length ? (
                data.genres.map((genre: string) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">Unknown Genre</Badge>
              )}
            </div>

            {/* Movie Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                {data.year || "Unknown Year"} • {data.country || "Unknown Country"}
              </p>
              <p>
                <strong>Director:</strong> {data.director || "N/A"}
              </p>
              <p>
                <strong>Cast:</strong> {data.cast || "N/A"}
              </p>
              <p>
                <strong>Quality:</strong> {data.quality || "N/A"}
              </p>
            </div>

            {/* Description */}
            {data.description && <p className="text-sm">{data.description}</p>}

            {/* Servers Section */}
            <div className="space-y-2">
              <h3 className="font-semibold">Available Servers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(data.servers || {})
                  .filter(
                    ([, server]) =>
                      server.name !== "Turn off light" && server.name !== "Comments"
                  )
                  .map(([key, server]) => (
                    <a
                      key={key}
                      href={key}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-md bg-secondary hover:bg-secondary/80 transition"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span className="text-sm">{server.name}</span>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
