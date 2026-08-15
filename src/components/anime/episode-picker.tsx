"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EpisodeListItem } from "@/types/api";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function EpisodePicker({
  slug,
  episodes,
  current,
}: {
  slug: string;
  episodes: EpisodeListItem[];
  current: number;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return episodes;
    return episodes.filter(
      (episode) =>
        String(episode.episode_number ?? "").includes(needle) ||
        (episode.episode ?? "").toLowerCase().includes(needle),
    );
  }, [episodes, query]);

  return (
    <div className="border">
      <div className="border-b p-3">
        <p className="eyebrow mb-2">Episode ({episodes.length})</p>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nomor episode…"
          inputMode="numeric"
          aria-label="Cari episode"
          className="h-8 text-sm"
        />
      </div>

      <ul className="scrollbar-thin max-h-[60vh] overflow-y-auto">
        {filtered.map((episode) => {
          const active = episode.episode_number === current;
          return (
            <li key={episode.slug} className="border-b last:border-b-0">
              <Link
                href={
                  episode.episode_number !== undefined
                    ? `/anime/${slug}/episodes/${episode.episode_number}`
                    : `/anime/${slug}`
                }
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
                )}
              >
                <span className="w-8 shrink-0 font-mono text-xs tabular-nums">
                  {episode.episode_number !== undefined
                    ? String(episode.episode_number).padStart(2, "0")
                    : "—"}
                </span>
                <span className="line-clamp-1">{episode.episode}</span>
              </Link>
            </li>
          );
        })}
        {!filtered.length ? (
          <li className="text-muted-foreground p-3 text-sm">Tidak ada episode cocok.</li>
        ) : null}
      </ul>
    </div>
  );
}
