"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal, snap-scrolling row — the Netflix shelf pattern.
 *
 * Rows beat grids on a home page: each domain gets a full row of its own
 * without the page growing endlessly, and a partially-filled row is impossible
 * by construction, so there is no empty-cell problem.
 *
 * Scrolling is native (touch, trackpad, shift+wheel and keyboard all work for
 * free); the arrows are a desktop affordance layered on top, and they hide
 * themselves at the ends rather than sitting there disabled.
 */
export default function Rail({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft >= max - 8);
  }, []);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Move by ~90% of a viewport so a sliver of the next card stays visible,
    // which is what tells people the row continues.
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className={cn("group/rail relative", className)}>
      <div
        ref={trackRef}
        onScroll={sync}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-px overflow-x-auto scroll-smooth px-4 sm:-mx-6 sm:px-6"
      >
        {children}
      </div>

      <RailButton side="left" hidden={atStart} onClick={() => scrollBy(-1)} />
      <RailButton side="right" hidden={atEnd} onClick={() => scrollBy(1)} />
    </div>
  );
}

function RailButton({
  side,
  hidden,
  onClick,
}: {
  side: "left" | "right";
  hidden: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      aria-label={side === "left" ? "Geser ke kiri" : "Geser ke kanan"}
      className={cn(
        "bg-background/90 hover:bg-accent absolute top-0 bottom-0 z-10 hidden w-10 items-center justify-center border backdrop-blur",
        "opacity-0 transition-opacity duration-200 ease-[var(--ease-out)] group-hover/rail:opacity-100 focus-visible:opacity-100",
        "lg:flex",
        side === "left" ? "-left-1" : "-right-1",
        hidden && "pointer-events-none !opacity-0",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
