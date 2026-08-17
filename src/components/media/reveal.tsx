"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades a section in when it scrolls into view, instead of on mount.
 *
 * `.stagger`/`.animate-rise` (used inside `PosterGrid` and elsewhere) are
 * plain CSS animations that fire the instant an element enters the DOM —
 * fine for what is already on screen at load, but every shelf below the fold
 * had already finished "animating in" invisibly before a visitor scrolled far
 * enough to see it. This wraps such a section in its own opacity/transform
 * transition, gated by an `IntersectionObserver`, without touching any class
 * on the content itself — the wrapper is the only thing that moves.
 *
 * With JavaScript disabled the wrapper simply never gets `.is-visible`; see
 * `.reveal`'s `<noscript>`-equivalent handling below, which keeps content
 * visible by default and only hides it once the observer is confirmed to be
 * running.
 */
export default function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only hide-then-reveal once JS has actually confirmed it can observe —
    // this is what prevents a slow-to-hydrate page from stranding the section
    // invisible.
    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(armed && "reveal", visible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
