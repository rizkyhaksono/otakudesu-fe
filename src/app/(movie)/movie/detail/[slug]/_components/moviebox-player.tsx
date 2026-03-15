"use client";

import { useGetMovieBoxSourcesQuery } from "@/redux/api/movie/moviebox-api";
import { MovieBoxSource } from "@/types/movie";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkeletonCard from "@/components/layout/skeleton-card";

interface MovieBoxPlayerProps {
  subjectId: string;
}

export default function MovieBoxPlayer({ subjectId }: Readonly<MovieBoxPlayerProps>) {
  const { data: sourcesData, error, isLoading } = useGetMovieBoxSourcesQuery(subjectId);
  const [selectedSource, setSelectedSource] = useState<MovieBoxSource | null>(null);

  if (isLoading) return <SkeletonCard />;
  if (error) return <div className="text-center text-red-500">Error loading video sources</div>;

  const sources = sourcesData?.processedSources || [];

  // Auto-select highest quality if nothing selected yet
  if (sources.length > 0 && !selectedSource) {
    const highestQuality = sources.reduce((prev: MovieBoxSource, current: MovieBoxSource) =>
      prev.quality > current.quality ? prev : current
    );
    setSelectedSource(highestQuality);
  }

  return (
    <div className="mt-5 space-y-4">
      {/* Quality selector */}
      {sources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold">Quality:</span>
          {sources.map((source: MovieBoxSource) => (
            <Button
              key={source.id}
              variant={selectedSource?.id === source.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSource(source)}
            >
              {source.quality}p
              <Badge variant="secondary" className="ml-2">
                {source.format.toUpperCase()}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      {/* Video player */}
      {selectedSource && (
        <video
          key={selectedSource.id}
          controls
          className="h-[200px] w-full rounded-xl sm:h-[300px] sm:w-full md:h-[400px] md:w-full lg:h-[500px] lg:w-full xl:h-[600px] xl:w-full"
          poster={sourcesData?.metadata?.image}
        >
          <source src={selectedSource.directUrl} type={`video/${selectedSource.format}`} />
          <track kind="captions" label="English" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
