"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  List,
  Maximize2,
  Minimize2,
  MoveVertical,
} from "lucide-react";
import type { ComicChapter } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Mode = "strip" | "paged";
type Width = "fit" | "full" | "narrow";

/**
 * Lazy initialiser: `useState` initialisers do not run on the server, so this
 * is safe and avoids a post-mount state update.
 */
function readPref<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return (localStorage.getItem(key) as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}

const WIDTH_CLASS: Record<Width, string> = {
  narrow: "max-w-2xl",
  fit: "max-w-4xl",
  full: "max-w-none",
};

/**
 * Full comic reader.
 *
 * Chapters here run to ~80 images, so only the first two are eager — the rest
 * lazy-load as you scroll. That is the difference between a page that opens
 * instantly and one that downloads 30 MB up front.
 */
export default function ComicReader({ slug, chapter }: { slug: string; chapter: ComicChapter }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(() => readPref("natee.reader.mode", "strip"));
  const [width, setWidth] = useState<Width>(() => readPref("natee.reader.width", "fit"));
  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = chapter.images.length;

  const prevHref =
    chapter.prev?.chapter_number != null
      ? `/comic/${slug}/chapter/${chapter.prev.chapter_number}`
      : null;
  const nextHref =
    chapter.next?.chapter_number != null
      ? `/comic/${slug}/chapter/${chapter.next.chapter_number}`
      : null;

  // Preferences persist between chapters. Written on change rather than read
  // back in an effect, so there is no setState-during-mount cascade.
  const setModePersisted = (value: Mode) => {
    setMode(value);
    try {
      localStorage.setItem("natee.reader.mode", value);
    } catch {
      /* storage disabled — preference simply will not persist */
    }
  };

  const setWidthPersisted = (value: Width) => {
    setWidth(value);
    try {
      localStorage.setItem("natee.reader.width", value);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (mode !== "strip") return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  const goNextPage = useCallback(() => setPage((value) => Math.min(total - 1, value + 1)), [total]);
  const goPrevPage = useCallback(() => setPage((value) => Math.max(0, value - 1)), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;

      if (mode === "paged") {
        if (event.key === "ArrowRight" || event.key === "d") goNextPage();
        if (event.key === "ArrowLeft" || event.key === "a") goPrevPage();
      }
      if (event.key === "j") window.scrollBy({ top: window.innerHeight * 0.85 });
      if (event.key === "k") window.scrollBy({ top: -window.innerHeight * 0.85 });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, goNextPage, goPrevPage]);

  const chapterOptions = useMemo(
    () => chapter.chapters.filter((entry) => entry.chapter_number != null),
    [chapter.chapters],
  );

  return (
    <div ref={containerRef}>
      {/* Reading progress: thin, unobtrusive, only in strip mode. */}
      {mode === "strip" ? (
        <div
          className="bg-primary fixed top-0 left-0 z-50 h-0.5 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      ) : null}

      <header className="bg-background sticky top-14 z-30 border-b">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
          <div className="min-w-0 flex-1">
            <Link
              href={`/comic/${slug}`}
              className="hover:text-primary block truncate text-sm font-semibold"
            >
              {chapter.comic.title}
            </Link>
            <p className="text-muted-foreground font-mono text-[0.7rem] tabular-nums">
              {chapter.title ?? `Chapter ${chapter.chapter_number}`} · {total} halaman
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={mode === "strip" ? "Mode halaman" : "Mode gulir"}
              onClick={() => setModePersisted(mode === "strip" ? "paged" : "strip")}
            >
              {mode === "strip" ? (
                <Columns2 className="size-4" aria-hidden />
              ) : (
                <MoveVertical className="size-4" aria-hidden />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Ubah lebar baca"
              onClick={() =>
                setWidthPersisted(width === "narrow" ? "fit" : width === "fit" ? "full" : "narrow")
              }
            >
              {width === "full" ? (
                <Minimize2 className="size-4" aria-hidden />
              ) : (
                <Maximize2 className="size-4" aria-hidden />
              )}
            </Button>

            <Select
              value={String(chapter.chapter_number ?? "")}
              onValueChange={(value) => router.push(`/comic/${slug}/chapter/${value}`)}
            >
              <SelectTrigger className="h-8 w-36" aria-label="Pilih chapter">
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {chapterOptions.map((entry) => (
                  <SelectItem key={entry.chapter_number} value={String(entry.chapter_number)}>
                    {entry.title ?? `Chapter ${entry.chapter_number}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button asChild variant="ghost" size="icon" className="size-8">
              <Link href={`/comic/${slug}`} aria-label="Daftar chapter">
                <List className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className={cn("mx-auto px-0 sm:px-4", WIDTH_CLASS[width])}>
        {mode === "strip" ? (
          <div className="flex flex-col">
            {chapter.images.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`Halaman ${index + 1}`}
                width={800}
                height={1200}
                sizes="(min-width: 1024px) 800px, 100vw"
                priority={index < 2}
                loading={index < 2 ? "eager" : "lazy"}
                className="h-auto w-full"
                unoptimized
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <Image
              key={chapter.images[page]}
              src={chapter.images[page]!}
              alt={`Halaman ${page + 1}`}
              width={800}
              height={1200}
              sizes="(min-width: 1024px) 800px, 100vw"
              priority
              className="h-auto w-full"
              unoptimized
            />
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goPrevPage} disabled={page === 0}>
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
              <span className="font-mono text-xs tabular-nums">
                {page + 1} / {total}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goNextPage}
                disabled={page >= total - 1}
              >
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        )}
      </div>

      <nav className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-8">
        {prevHref ? (
          <Button asChild variant="outline" className="gap-1">
            <Link href={prevHref}>
              <ChevronLeft className="size-4" aria-hidden />
              {chapter.prev?.title ?? "Sebelumnya"}
            </Link>
          </Button>
        ) : (
          <span />
        )}

        {nextHref ? (
          <Button asChild className="gap-1">
            <Link href={nextHref}>
              {chapter.next?.title ?? "Berikutnya"}
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </Button>
        ) : (
          <span className="text-muted-foreground font-mono text-xs uppercase">
            Chapter terbaru
          </span>
        )}
      </nav>
    </div>
  );
}
