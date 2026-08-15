import { Star } from "lucide-react";

export type RateTarget = { href: string; label: string; note?: string };

/**
 * "Rate this on …" actions.
 *
 * Natee stores nothing about you on a server, so ratings live where people
 * already keep them: MyAnimeList for anime, Letterboxd for film. These are
 * plain outbound links — no API keys, no accounts here, nothing to sync.
 */
export default function RateElsewhere({ targets }: { targets: RateTarget[] }) {
  if (!targets.length) return null;

  return (
    <div className="grid gap-px bg-border [&>*]:bg-background">
      {targets.map((target) => (
        <a
          key={target.href}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className="press hover:bg-accent group flex items-center gap-2 border px-3 py-2 text-sm transition-colors"
        >
          <Star
            className="text-primary size-4 shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-110"
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">Beri rating di {target.label}</span>
            {target.note ? (
              <span className="text-muted-foreground block truncate font-mono text-[0.65rem] uppercase">
                {target.note}
              </span>
            ) : null}
          </span>
          <span className="text-muted-foreground shrink-0" aria-hidden>
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}

/**
 * MyAnimeList has no public id in our upstream data, so this lands on their
 * search with the title pre-filled — one click from the entry, and it never
 * points at the wrong show the way a guessed id would.
 */
export function malSearchUrl(title: string): string {
  return `https://myanimelist.net/search/all?q=${encodeURIComponent(title)}&cat=anime`;
}
