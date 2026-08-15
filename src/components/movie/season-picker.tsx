"use client";

import { useRouter } from "next/navigation";
import type { MovieEpisode, MovieSeasonRef } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Season/episode selection drives the URL rather than local state, so every
 * episode is a linkable, crawlable, shareable page.
 */
export default function SeasonPicker({
  id,
  seasons,
  episodes,
  currentSeason,
  currentEpisode,
}: {
  id: number;
  seasons: MovieSeasonRef[];
  episodes: MovieEpisode[];
  currentSeason: number;
  currentEpisode: number;
}) {
  const router = useRouter();

  return (
    <div className="border">
      <div className="border-b p-3">
        <p className="eyebrow mb-2">Musim</p>
        <Select
          value={String(currentSeason)}
          onValueChange={(value) => router.push(`/movie/tv/${id}?s=${value}&e=1`)}
        >
          <SelectTrigger className="h-9 w-full" aria-label="Pilih musim">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season.season_number} value={String(season.season_number)}>
                {season.name ?? `Musim ${season.season_number}`}
                {season.episode_count ? ` · ${season.episode_count} eps` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="scrollbar-thin max-h-[28rem] overflow-y-auto">
        {episodes.map((episode) => {
          const active = episode.episode_number === currentEpisode;
          return (
            <li key={episode.episode_number} className="border-b last:border-b-0">
              <button
                type="button"
                onClick={() =>
                  router.push(`/movie/tv/${id}?s=${currentSeason}&e=${episode.episode_number}`)
                }
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 px-3 py-2 text-left text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
                )}
              >
                <span className="w-8 shrink-0 pt-0.5 font-mono text-xs tabular-nums">
                  {String(episode.episode_number).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-1 block">{episode.name ?? `Episode ${episode.episode_number}`}</span>
                  {episode.air_date ? (
                    <span
                      className={cn(
                        "block font-mono text-[0.65rem]",
                        active ? "opacity-80" : "text-muted-foreground",
                      )}
                    >
                      {episode.air_date}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
        {!episodes.length ? (
          <li className="text-muted-foreground p-3 text-sm">Daftar episode belum tersedia.</li>
        ) : null}
      </ul>
    </div>
  );
}
