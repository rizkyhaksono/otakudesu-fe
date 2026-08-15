"use client";

import { useState } from "react";
import { MonitorPlay } from "lucide-react";
import type { EmbedSource } from "@/types/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Player with a server switcher.
 *
 * Coverage differs between embed providers, and any one of them can be down, so
 * the UI offers all of them rather than betting on a single source. Switching is
 * a state change — no reload, no refetch.
 */
export default function EmbedPlayer({
  sources,
  title,
}: {
  sources: EmbedSource[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = sources[active];

  if (!current) {
    return (
      <div className="text-muted-foreground border p-10 text-center text-sm">
        Belum ada server yang tersedia untuk judul ini.
      </div>
    );
  }

  return (
    <div>
      <div className="bg-muted relative aspect-video w-full border">
        <iframe
          // Remount on switch so the previous player stops playing.
          key={current.url}
          src={current.url}
          title={`${title} — ${current.name}`}
          className="absolute inset-0 size-full"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs uppercase">
          <MonitorPlay className="size-3.5" aria-hidden />
          Server
        </span>
        {sources.map((source, index) => (
          <Button
            key={source.provider}
            size="sm"
            variant={index === active ? "default" : "outline"}
            onClick={() => setActive(index)}
            className={cn("h-8 font-mono text-xs", index === active && "font-semibold")}
          >
            {index + 1}. {source.name}
          </Button>
        ))}
      </div>

      <p className="text-muted-foreground mt-2 text-xs">
        Pemutar disediakan pihak ketiga. Kalau satu server tidak jalan, coba server lain.
      </p>
    </div>
  );
}
