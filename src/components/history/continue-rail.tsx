"use client";

import Link from "next/link";
import { History, X } from "lucide-react";
import { clearHistory, getHistory, type HistoryEntry } from "@/lib/storage";
import { useStoredValue } from "@/hooks/use-storage";
import { Button } from "@/components/ui/button";
import EntryThumb from "@/components/history/entry-thumb";

const KIND_LABEL: Record<HistoryEntry["kind"], string> = {
  anime: "Anime",
  comic: "Komik",
  movie: "Film",
  tv: "TV",
  radio: "Radio",
};

/** Combined "continue watching / continue reading" rail across every domain. */
export default function ContinueRail() {
  const [history, mounted] = useStoredValue<HistoryEntry[]>(getHistory, []);

  if (!mounted || history.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-end justify-between gap-4 border-b pb-2">
        <div>
          <p className="eyebrow">Riwayat kamu</p>
          <h2 className="font-display flex items-center gap-2 text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            <History className="size-5" aria-hidden />
            Lanjutkan
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-muted-foreground shrink-0 font-mono text-xs uppercase"
        >
          <X className="size-3" aria-hidden />
          Bersihkan
        </Button>
      </div>

      <ul className="scrollbar-thin flex gap-px overflow-x-auto border bg-border [&>*]:bg-background">
        {history.slice(0, 18).map((entry) => (
          <li key={entry.id} className="w-36 shrink-0 sm:w-40">
            <Link href={entry.href} className="group block">
              <div className="bg-muted relative aspect-[2/3] border-b">
                <EntryThumb kind={entry.kind} poster={entry.poster} title={entry.title} />
                <span className="bg-foreground text-background absolute top-0 left-0 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase">
                  {KIND_LABEL[entry.kind]}
                </span>
              </div>
              <div className="p-2">
                <p className="group-hover:text-primary line-clamp-2 text-[0.8rem] leading-snug font-semibold">
                  {entry.title}
                </p>
                {entry.progress ? (
                  <p className="text-muted-foreground mt-0.5 font-mono text-[0.65rem]">
                    {entry.progress}
                  </p>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
