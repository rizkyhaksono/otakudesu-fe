"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, Loader2, MonitorPlay } from "lucide-react";
import type { EpisodeMirror } from "@/types/api";
import type { MuseMatch } from "@/services/anime";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "ready" | "error";
type Resolved = { url: string; embeddable: boolean };

/**
 * Episode player with a server switcher.
 *
 * Otakudesu lists a dozen mirrors per episode but only embeds one on page load.
 * When that one is down or geo-blocked the episode looks broken, even though
 * working alternatives are right there — which is exactly what users hit.
 *
 * Mirrors resolve lazily: each costs an upstream round-trip, so only the server
 * actually selected is resolved, and results are cached per token.
 *
 * The *first* playable source is resolved on the server (see the page), so the
 * player is filled on first paint with no client round-trip and no
 * setState-on-mount.
 */
export default function EpisodePlayer({
  title,
  initialSrc,
  mirrors,
  muse,
}: {
  title: string;
  initialSrc?: string | null;
  mirrors: EpisodeMirror[];
  /** Official Muse Indonesia playlist, when one matches this series. */
  muse?: MuseMatch | null;
}) {
  // Group by quality so the switcher reads "480p: a, b, c" rather than a flat wall.
  const groups = useMemo(() => {
    const byQuality = new Map<string, EpisodeMirror[]>();
    for (const mirror of mirrors) {
      const key = mirror.quality ?? "auto";
      byQuality.set(key, [...(byQuality.get(key) ?? []), mirror]);
    }
    return [...byQuality.entries()].sort(
      (a, b) => Number.parseInt(a[0], 10) - Number.parseInt(b[0], 10),
    );
  }, [mirrors]);

  const [selected, setSelected] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(initialSrc ?? null);
  const [status, setStatus] = useState<Status>(initialSrc ? "ready" : "idle");
  const [resolved, setResolved] = useState<Record<string, Resolved>>({});
  const [blocked, setBlocked] = useState<string | null>(null);

  const apply = (entry: Resolved) => {
    // Some hosts publish `frame-ancestors` that exclude us; the browser will
    // render nothing at all, so show an explicit escape hatch instead of a
    // blank rectangle the user cannot diagnose.
    if (!entry.embeddable) {
      setSrc(null);
      setBlocked(entry.url);
      setStatus("ready");
      return;
    }
    setBlocked(null);
    setSrc(entry.url);
    setStatus("ready");
  };

  const pick = useCallback(
    async (mirror: EpisodeMirror) => {
      setSelected(mirror.content);
      setBlocked(null);

      const cached = resolved[mirror.content];
      if (cached) {
        apply(cached);
        return;
      }

      setStatus("loading");
      try {
        const response = await fetch(
          `/api/mirror?content=${encodeURIComponent(mirror.content)}`,
          { cache: "force-cache" },
        );
        const body = (await response.json()) as {
          data?: { url?: string; embeddable?: boolean };
          error?: string;
        };
        const url = body.data?.url;

        if (!url) {
          setStatus("error");
          return;
        }

        const entry: Resolved = { url, embeddable: body.data?.embeddable !== false };
        setResolved((previous) => ({ ...previous, [mirror.content]: entry }));
        apply(entry);
      } catch {
        setStatus("error");
      }
    },
    [resolved],
  );

  return (
    <div>
      <div className="relative aspect-video w-full border bg-black">
        {src ? (
          <iframe
            key={src}
            src={src}
            title={title}
            className="absolute inset-0 size-full"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : null}

        {status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="size-6 animate-spin text-white" aria-hidden />
            <span className="sr-only">Memuat server…</span>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-6 text-center">
            <AlertTriangle className="size-6 text-white" aria-hidden />
            <p className="text-sm text-white">Server ini gagal dimuat.</p>
            <p className="text-xs text-white/70">Pilih server lain di bawah.</p>
          </div>
        ) : null}

        {blocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <ExternalLink className="text-muted-foreground size-6" aria-hidden />
            <p className="text-sm">Server ini tidak mengizinkan pemutaran tertanam.</p>
            <p className="text-muted-foreground max-w-sm text-xs">
              Penyedianya membatasi pemutar hanya untuk situs aslinya. Buka di tab baru, atau pilih
              server lain di bawah.
            </p>
            <a
              href={blocked}
              target="_blank"
              rel="noopener noreferrer"
              className="press bg-foreground text-background hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
            >
              <ExternalLink className="size-4" aria-hidden />
              Buka di tab baru
            </a>
          </div>
        ) : null}

        {status === "idle" && !src && !blocked ? (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-sm">
            Tidak ada server tersedia untuk episode ini.
          </div>
        ) : null}
      </div>

      {muse ? (
        <div className="mt-3 border">
          <p className="eyebrow flex items-center gap-1.5 border-b px-3 py-2">
            <MonitorPlay className="size-3.5" aria-hidden />
            Sumber resmi
          </p>
          <div className="flex flex-wrap items-center gap-2 p-2">
            <Button
              size="sm"
              variant={src === muse.url ? "default" : "outline"}
              className="press h-7 font-mono text-xs"
              onClick={() => {
                setSelected(null);
                setBlocked(null);
                setSrc(muse.url);
                setStatus("ready");
              }}
            >
              Muse Indonesia
            </Button>
            <span className="text-muted-foreground text-xs">
              Playlist resmi berlisensi — seluruh seri, bukan per-episode.
            </span>
          </div>
        </div>
      ) : null}

      {groups.length ? (
        <div className="mt-3 border">
          <p className="eyebrow flex items-center gap-1.5 border-b px-3 py-2">
            <MonitorPlay className="size-3.5" aria-hidden />
            Pilih server
          </p>

          <div className="divide-y">
            {groups.map(([quality, list]) => (
              <div key={quality} className="flex flex-wrap items-center gap-1.5 p-2">
                <span className="text-muted-foreground w-12 shrink-0 font-mono text-xs tabular-nums">
                  {quality}
                </span>
                {list.map((mirror) => (
                  <Button
                    key={mirror.content}
                    size="sm"
                    variant={selected === mirror.content ? "default" : "outline"}
                    onClick={() => void pick(mirror)}
                    className={cn("press h-7 font-mono text-xs")}
                  >
                    {mirror.provider}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
