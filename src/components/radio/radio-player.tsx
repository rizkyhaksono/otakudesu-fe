"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, Pause, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/client";

type Status = "idle" | "loading" | "playing" | "error";

/**
 * Radio player.
 *
 * Most stations are a continuous MP3/AAC stream that `<audio>` handles on its
 * own; a minority publish HLS, which needs hls.js everywhere except Safari.
 * That library is imported dynamically so it only costs anything on the pages
 * that actually need it.
 *
 * Playback tries the direct URL first and falls back to the backend proxy —
 * the same direct-first strategy as the TV player, for the same reason: only
 * some upstreams send CORS headers, and plain-HTTP streams are blocked outright
 * on an HTTPS page (those arrive with `direct` already null).
 */
export default function RadioPlayer({
  direct,
  proxyUrl,
  apiBase,
  stationName,
}: {
  direct: string | null;
  proxyUrl: string;
  apiBase: string;
  stationName: string;
}) {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [useProxy, setUseProxy] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [volume, setVolume] = useState(1);

  const viaProxy = useProxy || !direct;
  const src = viaProxy ? `${apiBase}${proxyUrl}` : direct!;

  const fallback = () => {
    if (!viaProxy) {
      setUseProxy(true);
      setStatus("loading");
    } else {
      setStatus("error");
    }
  };

  // Live audio has no timeline to resume, so a source change always restarts
  // from the live edge — there is no playback position to preserve.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let destroy: (() => void) | undefined;
    let cancelled = false;

    const isHls = /\.m3u8(\?|$)/i.test(src);
    const nativeHls = audio.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (isHls && !nativeHls) {
      void import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(audio);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) fallback();
        });
        destroy = () => hls.destroy();
      });
    } else {
      audio.src = src;
      audio.load();
    }

    return () => {
      cancelled = true;
      destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      await audio.play();
      setStatus("playing");
    } catch {
      fallback();
    }
  };

  return (
    <div className="border">
      <div className="flex items-center gap-4 p-4">
        <Button
          size="icon"
          className="size-12 shrink-0"
          onClick={toggle}
          disabled={status === "error"}
          aria-label={`${status === "playing" ? t.pages.radio.pause : t.pages.radio.play} ${stationName}`}
        >
          {status === "loading" ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : status === "playing" ? (
            <Pause className="size-5" aria-hidden />
          ) : (
            <Play className="size-5" aria-hidden />
          )}
        </Button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{stationName}</p>
          <p className="text-muted-foreground font-mono text-[0.7rem] uppercase">
            {status === "playing" ? (
              <span className="text-primary inline-flex items-center gap-1.5">
                <span className="bg-primary size-1.5 animate-pulse" aria-hidden />
                {t.pages.radio.onAir}
              </span>
            ) : status === "error" ? (
              t.pages.radio.streamError
            ) : status === "loading" ? (
              t.pages.radio.connecting
            ) : (
              t.pages.radio.ready
            )}
            {viaProxy && status !== "error" ? " · via proxy" : ""}
          </p>
        </div>

        <label className="hidden items-center gap-2 sm:flex">
          <Volume2 className="text-muted-foreground size-4" aria-hidden />
          <span className="sr-only">{t.pages.radio.volume}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => {
              const next = Number(event.target.value);
              setVolume(next);
              if (audioRef.current) audioRef.current.volume = next;
            }}
            className="accent-primary w-24"
          />
        </label>
      </div>

      {status === "error" ? (
        <p className="text-muted-foreground flex items-center gap-2 border-t p-3 text-xs">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
          {t.pages.radio.offlineHint}
        </p>
      ) : null}

      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus("loading")}
        onError={fallback}
        className="hidden"
      />
    </div>
  );
}
