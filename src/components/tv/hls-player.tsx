"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Stream = {
  quality: string | null;
  title: string | null;
  /** Direct URL — only present when the stream sends CORS headers. */
  url: string | null;
  /** Always available; goes through the backend proxy. */
  proxy_url: string;
};

type Status = "loading" | "playing" | "error";

/**
 * Live TV player.
 *
 * Safari plays HLS natively; everywhere else needs hls.js, which is imported
 * dynamically so its ~150 KB only loads on this page.
 *
 * Playback is attempted direct-first and falls back to the backend proxy. Only
 * some upstreams send CORS headers, and the ones that need a custom User-Agent
 * or Referer can never work from the browser at all.
 */
export default function HlsPlayer({
  streams,
  apiBase,
  channelName,
}: {
  streams: Stream[];
  apiBase: string;
  channelName: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [useProxy, setUseProxy] = useState(false);
  const [status, setStatus] = useState<Status>("loading");

  const stream = streams[index];
  // A stream flagged proxy-only has no direct URL to try, so force the proxy
  // during render rather than correcting it afterwards in an effect.
  const viaProxy = useProxy || !stream?.url;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    const src = !viaProxy && stream.url ? stream.url : `${apiBase}${stream.proxy_url}`;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    setStatus("loading");

    const fallbackToProxy = () => {
      if (!viaProxy) {
        setUseProxy(true);
        return true;
      }
      setStatus("error");
      return false;
    };

    const start = async () => {
      // Safari and iOS play HLS without a library.
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.play().catch(() => undefined);
        setStatus("playing");
        return;
      }

      const { default: Hls } = await import("hls.js");
      if (cancelled) return;

      if (!Hls.isSupported()) {
        setStatus("error");
        return;
      }

      const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 60 });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus("playing");
        video.play().catch(() => undefined);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && fallbackToProxy()) {
          hls.destroy();
          return;
        }
        setStatus("error");
        hls.destroy();
      });

      destroy = () => hls.destroy();
    };

    void start();

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [stream, viaProxy, apiBase]);

  if (!stream) {
    return (
      <div className="text-muted-foreground border p-10 text-center text-sm">
        Channel ini sedang tidak punya stream aktif.
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-video w-full border bg-black">
        <video
          ref={videoRef}
          controls
          playsInline
          autoPlay
          muted
          className="size-full"
          aria-label={`Siaran langsung ${channelName}`}
        />

        {status === "loading" ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="size-6 animate-spin text-white" aria-hidden />
            <span className="sr-only">Memuat siaran…</span>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center">
            <AlertTriangle className="size-6 text-white" aria-hidden />
            <p className="text-sm text-white">Siaran tidak bisa dimuat saat ini.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setUseProxy(true);
                setStatus("loading");
              }}
            >
              Coba lewat proxy
            </Button>
          </div>
        ) : null}
      </div>

      {streams.length > 1 ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground font-mono text-xs uppercase">Kualitas</span>
          {streams.map((option, optionIndex) => (
            <Button
              key={`${option.proxy_url}-${optionIndex}`}
              size="sm"
              variant={optionIndex === index ? "default" : "outline"}
              className={cn("h-8 font-mono text-xs")}
              onClick={() => {
                setIndex(optionIndex);
                setUseProxy(false);
              }}
            >
              {option.quality ?? option.title ?? `Stream ${optionIndex + 1}`}
            </Button>
          ))}
        </div>
      ) : null}

      <p className="text-muted-foreground mt-2 text-xs">
        {viaProxy ? "Diputar lewat proxy server." : "Diputar langsung dari sumber."}
      </p>
    </div>
  );
}
