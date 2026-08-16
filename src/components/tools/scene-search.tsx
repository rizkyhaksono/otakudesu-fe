"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ImageUp, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import type { SceneMatch, SceneSearchResult } from "@/types/api";

type Status = "idle" | "loading" | "done" | "error";

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/**
 * Reverse image search against trace.moe.
 *
 * Two independent entry points feeding one result renderer: a URL field posts
 * to our GET proxy, a drop zone posts the raw bytes to our POST proxy. Both
 * hit the same-origin `/api/identify` route — never the backend directly —
 * since `API_BASE_URL` never reaches the browser.
 */
export default function SceneSearch() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SceneSearchResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = async (run: () => Promise<Response>, previewSrc: string | null) => {
    setStatus("loading");
    setResult(null);
    setPreview(previewSrc);

    try {
      const response = await run();
      const payload = (await response.json()) as { data?: SceneSearchResult; error?: string };
      if (!response.ok || !payload.data) throw new Error(payload.error ?? "failed");
      setResult(payload.data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const searchByUrl = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    void runSearch(
      () => fetch(`/api/identify?url=${encodeURIComponent(trimmed)}`, { signal: AbortSignal.timeout(30_000) }),
      trimmed,
    );
  };

  const searchByFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    void runSearch(
      () =>
        fetch("/api/identify", {
          method: "POST",
          body: file,
          headers: { "Content-Type": file.type },
          signal: AbortSignal.timeout(30_000),
        }),
      URL.createObjectURL(file),
    );
  };

  return (
    <div>
      <form onSubmit={searchByUrl} className="flex gap-px bg-border">
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={t.pages.identify.urlPlaceholder}
          aria-label={t.pages.identify.urlLabel}
          className="h-11 flex-1 border-0"
        />
        <Button type="submit" className="h-11 gap-2 px-4" disabled={status === "loading"}>
          <Search className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t.pages.identify.submit}</span>
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground font-mono text-xs uppercase">{t.pages.identify.or}</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) searchByFile(file);
        }}
        className={cn(
          "border-primary/40 hover:border-primary flex w-full flex-col items-center gap-2 border border-dashed p-8 transition-colors",
          dragging && "border-primary bg-accent",
        )}
      >
        <ImageUp className="text-muted-foreground size-6" aria-hidden />
        <span className="text-sm font-medium">{t.pages.identify.uploadLabel}</span>
        <span className="text-muted-foreground text-xs">{t.pages.identify.uploadHint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) searchByFile(file);
          event.target.value = "";
        }}
      />

      {status === "loading" ? (
        <div className="mt-6 flex items-center gap-2 border p-4 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {t.pages.identify.searching}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-6 flex items-start gap-2 border p-4 text-sm">
          <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">{t.pages.identify.errorTitle}</p>
            <p className="text-muted-foreground">{t.pages.identify.errorBody}</p>
          </div>
        </div>
      ) : null}

      {status === "done" && result ? (
        <div className="mt-6">
          {preview ? (
            <figure className="bg-muted relative mb-4 aspect-video max-w-md border">
              {/* User-supplied source (URL or a local blob: URL from an upload) —
                  `next/image` can't optimize either, so this opts out rather
                  than needing every possible host in the remote allowlist. */}
              <Image src={preview} alt="" fill sizes="448px" unoptimized className="object-contain" />
            </figure>
          ) : null}

          {result.matches.length ? (
            <>
              <p className="eyebrow mb-2">{t.pages.identify.resultsTitle}</p>
              <ul className="grid gap-px border bg-border sm:grid-cols-2 [&>*]:bg-background">
                {result.matches.slice(0, 6).map((match) => (
                  <MatchCard key={`${match.anilistId}-${match.from}`} match={match} t={t} />
                ))}
              </ul>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">{t.pages.identify.noResults}</p>
          )}
        </div>
      ) : null}

      <p className="text-muted-foreground mt-8 font-mono text-[0.65rem] uppercase">
        {t.pages.identify.poweredBy}
      </p>
    </div>
  );
}

function MatchCard({
  match,
  t,
}: {
  match: SceneMatch;
  t: ReturnType<typeof useI18n>["t"];
}) {
  return (
    <li className="p-3">
      <div className="flex gap-3">
        {match.image ? (
          <span className="bg-muted relative size-16 shrink-0 border">
            {/* trace.moe-hosted preview frame; not part of our image allowlist. */}
            <Image
              src={match.image}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              unoptimized
            />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{match.title}</p>
          <p className="text-muted-foreground font-mono text-[0.65rem] uppercase">
            {(match.similarity * 100).toFixed(1)}%
            {match.episode ? ` · ${t.pages.identify.episode} ${match.episode}` : ""}
            {` · ${t.pages.identify.timestamp} ${formatTimestamp(match.from)}`}
          </p>
          {match.anilistId ? (
            <a
              href={`https://anilist.co/anime/${match.anilistId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary press mt-1 inline-block font-mono text-[0.65rem] uppercase"
            >
              {t.pages.identify.openOnAniList} →
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
