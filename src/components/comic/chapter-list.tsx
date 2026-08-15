"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { ComicChapterRef } from "@/types/api";
import { getReadParts } from "@/lib/storage";
import { useStoredValue } from "@/hooks/use-storage";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Stable reader so `useStoredValue` can memoise the snapshot. */
function useReadParts(slug: string): Set<number> {
  const read = useMemo(() => () => getReadParts(`comic:${slug}`), [slug]);
  const [parts] = useStoredValue<Set<number>>(read, EMPTY);
  return parts;
}

const EMPTY = new Set<number>();

export default function ChapterList({
  slug,
  chapters,
}: {
  slug: string;
  chapters: ComicChapterRef[];
}) {
  const [query, setQuery] = useState("");

  // Chapters already opened are marked, so a long list stays navigable.
  // Sourced from the progress store rather than history: history is capped at
  // 40 entries and holds one card per series, so it cannot answer this.
  const readParts = useReadParts(slug);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return chapters;
    return chapters.filter(
      (chapter) =>
        String(chapter.chapter_number ?? "").includes(needle) ||
        (chapter.title ?? "").toLowerCase().includes(needle),
    );
  }, [chapters, query]);

  return (
    <div>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari nomor chapter…"
        aria-label="Cari chapter"
        className="mb-3 h-9"
      />

      <ul className="scrollbar-thin grid max-h-[32rem] gap-px overflow-y-auto border bg-border sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-background">
        {filtered.map((chapter) => {
          const read =
            chapter.chapter_number !== null && readParts.has(chapter.chapter_number);
          return (
            <li key={chapter.slug ?? chapter.chapter_number}>
              <Link
                href={`/comic/${slug}/chapter/${chapter.chapter_number}`}
                className={cn(
                  "hover:bg-accent flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                  read && "text-muted-foreground",
                )}
              >
                {read ? <Check className="text-primary size-3 shrink-0" aria-hidden /> : null}
                <span className="line-clamp-1">{chapter.title ?? `Chapter ${chapter.chapter_number}`}</span>
                {chapter.released_at ? (
                  <span className="text-muted-foreground ml-auto shrink-0 font-mono text-[0.65rem]">
                    {new Date(chapter.released_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
        {!filtered.length ? (
          <li className="text-muted-foreground p-3 text-sm">Tidak ada chapter cocok.</li>
        ) : null}
      </ul>
    </div>
  );
}
