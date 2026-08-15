"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal, snap-scrolling row — the Netflix shelf pattern.
 *
 * Rows beat grids on a home page: each domain gets a row of its own without the
 * page growing endlessly, and a partially-filled row is impossible by
 * construction, so there is no empty-cell problem.
 *
 * Three input methods, all first-class:
 *  - native scroll (touch, trackpad, shift+wheel, keyboard)
 *  - click-and-drag with the mouse, so the arrows are optional rather than
 *    the only way to move on desktop
 *  - arrows, which stay as an affordance and hide themselves at the ends
 *
 * Drag is deliberately not a scroll *hijack*: snapping is disabled only while a
 * drag is in flight and restored on release, so the row still settles on a card.
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
  const [atEnd, setAtEnd] = useState(true);
  const [dragging, setDragging] = useState(false);

  // Kept in a ref: these change on every pointer move and must not re-render.
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(max <= 8 || track.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => observer.disconnect();
  }, [sync]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // ~90% of a viewport, so a sliver of the next card stays visible — that
    // overlap is what signals the row continues.
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  /**
   * Drag tracking deliberately avoids `setPointerCapture`.
   *
   * Capturing retargets the subsequent `click` to the capturing element, so the
   * anchor under the cursor never receives it — every card in a rail became
   * unclickable. Listening on `window` for the duration of the drag gives the
   * same behaviour while leaving click targeting alone.
   */
  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: PointerEvent) => {
      const track = trackRef.current;
      if (!track || !drag.current.active) return;

      const delta = event.clientX - drag.current.startX;
      drag.current.moved = Math.max(drag.current.moved, Math.abs(delta));
      track.scrollLeft = drag.current.startScroll - delta;
    };

    const onUp = () => {
      drag.current.active = false;
      setDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Touch already scrolls natively; hijacking it would fight the browser.
    if (event.pointerType === "touch" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: 0,
    };
    setDragging(true);
  };

  /**
   * A drag that moved more than a few pixels must not also trigger the link
   * under the cursor — otherwise every drag navigates away.
   */
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only a real drag suppresses the click; a plain click must always pass
    // through to the card underneath.
    if (drag.current.moved > 8) {
      event.preventDefault();
      event.stopPropagation();
    }
    drag.current.moved = 0;
  };

  return (
    <div className={cn("group/rail relative", className)}>
      <div
        ref={trackRef}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        className={cn(
          "scrollbar-none -mx-4 flex overflow-x-auto px-4 sm:-mx-6 sm:px-6",
          dragging
            ? "cursor-grabbing snap-none select-none"
            : "cursor-grab snap-x snap-mandatory scroll-smooth",
        )}
      >
        {children}
      </div>

      {/* Edge fades: the row reads as continuing rather than being cut off. */}
      <span
        aria-hidden
        className={cn(
          "from-background pointer-events-none absolute inset-y-0 -left-4 w-10 bg-gradient-to-r to-transparent transition-opacity duration-200 sm:-left-6",
          atStart && "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "from-background pointer-events-none absolute inset-y-0 -right-4 w-10 bg-gradient-to-l to-transparent transition-opacity duration-200 sm:-right-6",
          atEnd && "opacity-0",
        )}
      />

      <RailButton side="left" hidden={atStart} onClick={() => scrollByPage(-1)} />
      <RailButton side="right" hidden={atEnd} onClick={() => scrollByPage(1)} />
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
        "bg-background/95 hover:bg-accent absolute top-0 z-10 hidden size-10 items-center justify-center border backdrop-blur",
        "opacity-0 transition-opacity duration-200 ease-[var(--ease-out)] group-hover/rail:opacity-100 focus-visible:opacity-100",
        // Sits on the poster, vertically centred on it rather than on the whole
        // shelf, so it never drifts down over the titles.
        "top-[28%] lg:flex",
        side === "left" ? "left-0" : "right-0",
        hidden && "pointer-events-none !opacity-0",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
