"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Clapperboard, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/client";

export type HeroSlide = {
  href: string;
  title: string;
  poster?: string | null;
  /** Wide image when the source has one; portrait posters are blurred behind. */
  backdrop?: string | null;
  kind: string;
  meta?: string | null;
  synopsis?: string | null;
  /** YouTube id of the official trailer, when one was matched. */
  trailerId?: string | null;
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
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  // The trailer iframe exists only after a click: no YouTube script loads with the page.
  const [trailerOpen, setTrailerOpen] = useState(false);
  const playButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const activeTrailer = trailerOpen ? (slides[index]?.trailerId ?? null) : null;

  const closeTrailer = () => {
    setTrailerOpen(false);
    // Focus goes back to the control that opened the panel.
    window.setTimeout(() => playButton.current?.focus(), 0);
  };

  useEffect(() => {
    if (!activeTrailer) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTrailer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTrailer]);

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
    if (paused || trailerOpen || !autoPlay || slides.length < 2) return;

    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(timer);
  }, [paused, trailerOpen, autoPlay, slides.length]);

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
      <div className="relative h-[55svh] max-h-[620px] min-h-[320px] w-full overflow-hidden sm:h-[62vh] sm:min-h-[380px]">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const wide = slide.backdrop ?? null;

          return (
            <div
              key={slide.href}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)]",
                active ? "opacity-100" : "pointer-events-none opacity-0"
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
                    wide
                      ? active
                        ? "animate-ken-burns"
                        : "scale-100"
                      : "scale-110 blur-2xl brightness-[0.35]"
                  )}
                  unoptimized={!wide}
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-4 pb-12 sm:px-6 sm:pb-10">
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
                    <span className="chip animate-rise border-primary bg-primary text-primary-foreground">
                      {slide.kind}
                    </span>
                    <h2 className="animate-rise mt-3 line-clamp-3 font-display text-2xl leading-[1.05] font-extrabold tracking-tighter uppercase [animation-delay:60ms] sm:line-clamp-none sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    {slide.meta ? (
                      <p className="animate-rise mt-2 font-mono text-xs text-muted-foreground tabular-nums [animation-delay:100ms]">
                        {slide.meta}
                      </p>
                    ) : null}
                    {slide.synopsis ? (
                      <p className="animate-rise mt-3 line-clamp-2 max-w-xl text-sm text-muted-foreground [animation-delay:140ms] sm:line-clamp-3">
                        {slide.synopsis}
                      </p>
                    ) : null}

                    <div className="animate-rise mt-5 flex flex-wrap gap-2 [animation-delay:180ms]">
                      <Link
                        href={slide.href}
                        tabIndex={active ? 0 : -1}
                        className="press inline-flex min-h-11 items-center gap-2 bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-primary hover:text-primary-foreground"
                      >
                        <Play className="size-4 fill-current" aria-hidden />
                        Tonton sekarang
                      </Link>
                      {slide.trailerId ? (
                        <button
                          ref={active ? playButton : undefined}
                          type="button"
                          tabIndex={active ? 0 : -1}
                          onClick={() => setTrailerOpen(true)}
                          className="press inline-flex min-h-11 items-center gap-2 border border-foreground/50 px-5 py-2.5 text-sm font-semibold hover:border-foreground hover:bg-foreground/10"
                        >
                          <Clapperboard className="size-4" aria-hidden />
                          {t.common.playTrailer}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {activeTrailer ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
            <iframe
              key={activeTrailer}
              src={`https://www.youtube-nocookie.com/embed/${activeTrailer}?autoplay=1&rel=0&playsinline=1`}
              title={`Trailer ${slides[index]?.title ?? ""}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              // YouTube refuses to play embeds that arrive without a Referer (error 153).
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              // Full stage height at 16:9; on narrow screens the width caps and YouTube letterboxes.
              className="aspect-video h-full max-w-full border-0"
            />
            <button
              ref={closeButton}
              type="button"
              onClick={closeTrailer}
              aria-label={t.common.closeTrailer}
              className="press absolute top-3 right-3 inline-flex size-11 items-center justify-center bg-background/80 hover:bg-background"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        ) : null}
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
                  "relative h-1 overflow-hidden bg-foreground/30 transition-[width] duration-300 ease-[var(--ease-out)] hover:bg-foreground/60",
                  current ? "w-8" : "w-4"
                )}
              >
                {/* The fill only plays while autoplay is actually advancing —
                    paused-on-hover or reduced-motion both leave a plain
                    static dot, which is the honest state to show. */}
                {current && autoPlay && !paused ? (
                  <span
                    key={slide.href}
                    aria-hidden
                    className="animate-fill-bar absolute inset-y-0 left-0 bg-primary"
                    style={{ animationDuration: `${INTERVAL_MS}ms` }}
                  />
                ) : current ? (
                  <span aria-hidden className="absolute inset-0 bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
