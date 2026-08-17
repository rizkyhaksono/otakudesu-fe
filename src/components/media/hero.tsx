"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  href: string;
  title: string;
  poster?: string | null;
  /** Wide image when the source has one; portrait posters are blurred behind. */
  backdrop?: string | null;
  kind: string;
  meta?: string | null;
  synopsis?: string | null;
};

const INTERVAL_MS = 7000;

/**
 * Cinematic hero that rotates through featured titles.
 *
 * Anime and comic sources only publish portrait posters, so instead of
 * letterboxing them the poster is blown up and blurred to fill the stage, with
 * the sharp poster composited on top. That reads as intentional art direction
 * rather than a stretched image, and it works for every domain.
 *
 * Rotation stops on hover/focus and never starts at all under reduced motion —
 * an auto-advancing hero is exactly what that preference is about.
 */
export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Whether the timer is actually allowed to run at all — set once from a
  // media query, which is itself only readable after mount. Doing this in an
  // effect (rather than reading `matchMedia` during render) is what keeps
  // server and client markup identical on the first paint.
  useEffect(() => {
    // Deferred a tick rather than called synchronously in the effect body:
    // same rule as everywhere else in this codebase that reads a browser-only
    // API on mount — a bare `setState()` as the first statement of an effect
    // is what React 19's lint rule (correctly) rejects.
    const id = window.setTimeout(() => {
      setAutoPlay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (paused || !autoPlay || slides.length < 2) return;

    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused, autoPlay, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      aria-label="Sorotan"
      className="relative border-b"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[62vh] max-h-[620px] min-h-[380px] w-full overflow-hidden">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const wide = slide.backdrop ?? null;

          return (
            <div
              key={slide.href}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)]",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {/* Blurred bed: fills the stage regardless of source aspect ratio.
                  The slow zoom only plays for a real backdrop image, on the
                  active slide, and only re-triggers when it becomes active
                  again (the `key` forces a fresh mount). Blurred portrait
                  posters stay at a fixed scale instead — `blur-2xl` samples
                  past the edge of the image, and zooming that would slide the
                  unblurred edge into view. */}
              {slide.poster || wide ? (
                <Image
                  key={wide && active ? "active" : "idle"}
                  src={(wide ?? slide.poster)!}
                  alt=""
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover",
                    wide ? (active ? "animate-ken-burns" : "scale-100") : "scale-110 blur-2xl brightness-[0.35]",
                  )}
                  unoptimized={!wide}
                />
              ) : null}

              <div className="from-background via-background/85 absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

              <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-4 pb-10 sm:px-6">
                <div className="flex items-end gap-6">
                  {/* Sharp poster in front of its own blur. */}
                  {slide.poster ? (
                    <div className="relative hidden aspect-[2/3] w-36 shrink-0 border md:block lg:w-44">
                      <Image
                        src={slide.poster}
                        alt=""
                        fill
                        sizes="176px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  {/* `key`-ed to the slide so the entrance animation replays
                      every time this slide becomes active, not just on the
                      component's first mount. */}
                  <div key={active ? slide.href : undefined} className="max-w-2xl">
                    <span className="chip bg-primary text-primary-foreground border-primary animate-rise">
                      {slide.kind}
                    </span>
                    <h2 className="font-display animate-rise mt-3 text-3xl leading-[0.95] font-extrabold tracking-tighter uppercase [animation-delay:60ms] sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    {slide.meta ? (
                      <p className="text-muted-foreground animate-rise mt-2 font-mono text-xs tabular-nums [animation-delay:100ms]">
                        {slide.meta}
                      </p>
                    ) : null}
                    {slide.synopsis ? (
                      <p className="text-muted-foreground animate-rise mt-3 line-clamp-2 max-w-xl text-sm [animation-delay:140ms] sm:line-clamp-3">
                        {slide.synopsis}
                      </p>
                    ) : null}

                    <Link
                      href={slide.href}
                      tabIndex={active ? 0 : -1}
                      className="press bg-foreground text-background hover:bg-primary hover:text-primary-foreground animate-rise mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold [animation-delay:180ms]"
                    >
                      <Play className="size-4 fill-current" aria-hidden />
                      Tonton sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <div className="absolute right-4 bottom-4 z-10 flex gap-1.5 sm:right-6">
          {slides.map((slide, slideIndex) => {
            const current = slideIndex === index;
            return (
              <button
                key={slide.href}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Tampilkan ${slide.title}`}
                aria-current={current}
                className={cn(
                  "bg-foreground/30 hover:bg-foreground/60 relative h-1 overflow-hidden transition-[width] duration-300 ease-[var(--ease-out)]",
                  current ? "w-8" : "w-4",
                )}
              >
                {/* The fill only plays while autoplay is actually advancing —
                    paused-on-hover or reduced-motion both leave a plain
                    static dot, which is the honest state to show. */}
                {current && autoPlay && !paused ? (
                  <span
                    key={slide.href}
                    aria-hidden
                    className="bg-primary animate-fill-bar absolute inset-y-0 left-0"
                    style={{ animationDuration: `${INTERVAL_MS}ms` }}
                  />
                ) : current ? (
                  <span aria-hidden className="bg-primary absolute inset-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
