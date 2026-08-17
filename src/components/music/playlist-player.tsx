"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ListMusic, Loader2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export type MusicTrack = {
  id: string;
  title: string;
  /** e.g. "OP1 · One Piece · Artist name" — whatever context the caller has. */
  subtitle: string;
  audioUrl: string;
  cover: string | null;
  /** Link back to the anime's page, when the player spans several titles. */
  href?: string;
};

type Status = "idle" | "loading" | "playing" | "paused";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/**
 * A queue-based audio player for OP/ED tracks.
 *
 * One `<audio>` element for the whole queue rather than one per track — that
 * is what makes "next track" a source swap instead of a mount/unmount, so
 * playback never stutters between songs. The visible track list doubles as
 * the seek/skip UI: clicking any row jumps straight there.
 */
export default function PlaylistPlayer({
  tracks,
  compact = false,
}: {
  tracks: MusicTrack[];
  /** The anime detail page embeds a shorter, chrome-light version. */
  compact?: boolean;
}) {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[index];

  // A plain function, not an effect keyed on `index`: switching tracks is a
  // discrete user action (or `onEnded` firing), so resetting the displayed
  // position belongs in the handler that causes the change, not in a
  // synchronous effect body.
  const changeTrack = (next: number) => {
    setIndex(next);
    setTime(0);
    setDuration(0);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === "playing") {
      audio.pause();
      return;
    }

    setStatus("loading");
    try {
      await audio.play();
    } catch {
      setStatus("idle");
    }
  };

  const next = () => changeTrack((index + 1) % tracks.length);
  const prev = () => changeTrack((index - 1 + tracks.length) % tracks.length);

  if (!track) return null;

  return (
    <div className="border">
      <div className={cn("flex items-center gap-4 p-4", compact && "gap-3 p-3")}>
        <span
          className={cn(
            "bg-muted relative shrink-0 border",
            compact ? "size-12" : "size-16",
          )}
        >
          {track.cover ? (
            <Image src={track.cover} alt="" fill sizes="64px" className="object-cover" unoptimized />
          ) : (
            <span className="text-muted-foreground flex size-full items-center justify-center">
              <ListMusic className="size-5" aria-hidden />
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          {track.href ? (
            <Link href={track.href} className="hover:text-primary block truncate font-semibold">
              {track.title}
            </Link>
          ) : (
            <p className="truncate font-semibold">{track.title}</p>
          )}
          <p className="text-muted-foreground truncate font-mono text-[0.65rem] uppercase">
            {track.subtitle}
          </p>

          {!compact ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-muted-foreground w-9 shrink-0 font-mono text-[0.6rem] tabular-nums">
                {formatTime(time)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={Math.min(time, duration || 0)}
                onChange={(event) => {
                  const audio = audioRef.current;
                  if (audio) audio.currentTime = Number(event.target.value);
                }}
                className="accent-primary h-1 flex-1"
                aria-label={t.pages.music.seek}
              />
              <span className="text-muted-foreground w-9 shrink-0 font-mono text-[0.6rem] tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {tracks.length > 1 ? (
            <button
              type="button"
              onClick={prev}
              aria-label={t.pages.music.previous}
              className="press hover:bg-accent flex size-8 items-center justify-center"
            >
              <SkipBack className="size-4" aria-hidden />
            </button>
          ) : null}

          <button
            type="button"
            onClick={toggle}
            aria-label={status === "playing" ? t.pages.radio.pause : t.pages.radio.play}
            className="press bg-primary text-primary-foreground hover:bg-primary/90 flex size-9 items-center justify-center"
          >
            {status === "loading" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : status === "playing" ? (
              <Pause className="size-4" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
          </button>

          {tracks.length > 1 ? (
            <button
              type="button"
              onClick={next}
              aria-label={t.pages.music.next}
              className="press hover:bg-accent flex size-8 items-center justify-center"
            >
              <SkipForward className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      {tracks.length > 1 ? (
        <ul className="max-h-72 overflow-y-auto border-t">
          {tracks.map((item, itemIndex) => (
            <li key={item.id} className="border-b last:border-b-0">
              <button
                type="button"
                onClick={() => changeTrack(itemIndex)}
                className={cn(
                  "press hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-left",
                  itemIndex === index && "bg-accent",
                )}
              >
                <span className="text-muted-foreground w-5 shrink-0 font-mono text-[0.65rem] tabular-nums">
                  {itemIndex === index && status === "playing" ? (
                    <span className="bg-primary block size-1.5 animate-pulse" aria-hidden />
                  ) : (
                    itemIndex + 1
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  <span className="text-muted-foreground block truncate font-mono text-[0.6rem] uppercase">
                    {item.subtitle}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="none"
        onPlaying={() => setStatus("playing")}
        onPause={() => setStatus((current) => (current === "loading" ? current : "idle"))}
        onWaiting={() => setStatus("loading")}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={next}
        onError={next}
        autoPlay={status !== "idle"}
        className="hidden"
      />
    </div>
  );
}
