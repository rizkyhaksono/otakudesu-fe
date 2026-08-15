import type { ReactNode } from "react";
import Link from "next/link";
import PosterImage from "@/components/media/poster-image";
import { cn } from "@/lib/utils";

export type PosterCardProps = {
  href: string;
  title: string;
  poster?: string | null;
  /** Small uppercase tag rendered over the poster, e.g. "Eps 12". */
  badge?: string | null;
  /** Secondary line under the title. */
  meta?: string | null;
  rating?: string | number | null;
  accent?: "ongoing" | "completed" | "none";
  priority?: boolean;
  sizes?: string;
  /** Shown instead of the neutral tile when there is no artwork at all. */
  fallback?: ReactNode;
};

const DEFAULT_SIZES =
  "(min-width: 1536px) 12vw, (min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 640px) 25vw, 45vw";

/**
 * The single card used across anime, comics and films.
 *
 * Structure comes from a hairline border and a flat accent block — no shadow,
 * no radius, no hover lift beyond a border/colour change.
 */
export default function PosterCard({
  href,
  title,
  poster,
  badge,
  meta,
  rating,
  accent = "none",
  priority = false,
  sizes = DEFAULT_SIZES,
  fallback,
}: PosterCardProps) {
  return (
    <Link
      href={href}
      className="group focus-visible:outline-ring block focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <article className="bg-card hover:border-primary/60 flex h-full flex-col border transition-colors">
        <div className="bg-muted relative aspect-[2/3] w-full overflow-hidden border-b">
          <PosterImage
            src={poster}
            alt=""
            sizes={sizes}
            priority={priority}
            fallback={fallback}
            className="group-hover:scale-[1.03] group-hover:brightness-110"
          />

          {badge ? (
            <span
              className={cn(
                "absolute top-0 left-0 px-1.5 py-0.5 font-mono text-[0.65rem] leading-tight font-medium tracking-wide uppercase",
                accent === "ongoing" && "bg-primary text-primary-foreground",
                accent === "completed" && "bg-completed text-background",
                accent === "none" && "bg-foreground text-background",
              )}
            >
              {badge}
            </span>
          ) : null}

          {rating ? (
            <span className="bg-background/90 absolute right-0 bottom-0 border-t border-l px-1.5 py-0.5 font-mono text-[0.65rem] leading-tight tabular-nums">
              ★ {rating}
            </span>
          ) : null}
        </div>

        {/*
          Fixed heights, not intrinsic ones: titles run from one to three lines,
          and letting each card size itself leaves a row with a ragged bottom
          edge. Two clamped lines plus a reserved meta line keeps every card in
          a shelf exactly the same height.
        */}
        {/*
          Heights are pinned in px against an explicit line-height, not guessed
          in `em`. A `1em` box on a 0.68rem font is ~11px while the line itself
          needs 16px, which clipped the descenders off every meta line; and a
          `2.4em` title box was shorter than the two `leading-snug` lines it was
          meant to hold, so the overflow pushed into the row below.
        */}
        <div className="flex flex-1 flex-col p-2">
          <h3 className="group-hover:text-primary line-clamp-2 h-8 text-[0.8rem] leading-4 font-semibold transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mt-1.5 h-4 truncate font-mono text-[0.68rem] leading-4 tabular-nums">
            {meta ?? ""}
          </p>
        </div>
      </article>
    </Link>
  );
}
