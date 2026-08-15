"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { hasSeenTour, markTourSeen } from "@/lib/onboarding";
import { TOUR_EVENT, TOUR_STEPS } from "@/lib/tour";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Rect = { top: number; left: number; width: number; height: number };

const CARD_WIDTH = 340;
const GAP = 12;
const MARGIN = 12;

/**
 * Guided product tour.
 *
 * Unlike the welcome card it replaces, this walks the real interface: each step
 * highlights the control it is talking about, so a first-time visitor learns
 * where things are rather than just what exists.
 *
 * The highlight is a single element with a very large spread shadow — that
 * dims everything except the target without needing a mask or four overlay
 * panels, and it stays crisp at any size. When a step's element is not on the
 * page (hidden below `lg`, or a control this route does not render) the step
 * degrades to a centred card instead of pointing at nothing.
 *
 * It runs once automatically and can be replayed at any time from the footer,
 * which is why the state lives behind an event rather than a mount-time flag.
 */
export default function ProductTour({ active }: { active: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const current = TOUR_STEPS[step]!;
  const last = step === TOUR_STEPS.length - 1;

  const close = useCallback(() => {
    markTourSeen();
    setOpen(false);
    setStep(0);
  }, []);

  // Replay from anywhere (footer link, mobile menu).
  useEffect(() => {
    const onStart = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener(TOUR_EVENT, onStart);
    return () => window.removeEventListener(TOUR_EVENT, onStart);
  }, []);

  // First visit: run once the support prompt is out of the way.
  useEffect(() => {
    if (!active || hasSeenTour()) return;
    const timer = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [active]);

  // Measure after layout so the highlight never paints in the wrong place.
  useLayoutEffect(() => {
    if (!open) return;

    const measure = () => {
      const element = current.target
        ? document.querySelector<HTMLElement>(current.target)
        : null;

      if (!element || element.offsetParent === null) {
        setRect(null);
        return;
      }

      const box = element.getBoundingClientRect();
      setRect({ top: box.top, left: box.left, width: box.width, height: box.height });
    };

    measure();

    // The header is sticky, but the page underneath still moves.
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, current]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") setStep((s) => Math.min(TOUR_STEPS.length - 1, s + 1));
      if (event.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);

    // The page behind a modal tour must not scroll away under it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  if (!open) return null;

  const anchored = rect !== null;

  // Prefer below the target; flip above when the card would run off-screen.
  const card = (() => {
    if (!rect) return null;

    const below = rect.top + rect.height + GAP;
    const flip = below + 210 > window.innerHeight;
    const left = Math.min(
      Math.max(MARGIN, rect.left + rect.width / 2 - CARD_WIDTH / 2),
      window.innerWidth - CARD_WIDTH - MARGIN,
    );

    return flip
      ? { left, bottom: window.innerHeight - rect.top + GAP }
      : { left, top: below };
  })();

  // Rendered twice (anchored card and mobile sheet) — built once as an
  // element rather than a nested component, so it never remounts on re-render.
  const content = (
    <>
      <div className="flex items-center justify-between border-b p-3">
        <p className="eyebrow">
          {t.tour.title} · {step + 1}/{TOUR_STEPS.length}
        </p>
        <button
          type="button"
          onClick={close}
          aria-label={t.common.close}
          className="press hover:bg-accent -m-1 p-1"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="p-4">
        <h2 className="font-display text-lg font-extrabold tracking-tight uppercase">
          {current.title(t)}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{current.body(t)}</p>
        {current.href ? (
          <Link
            href={current.href}
            onClick={close}
            className="text-primary press mt-3 inline-block font-mono text-xs uppercase"
          >
            {t.tour.goThere} →
          </Link>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-t p-3">
        <div className="flex gap-1" aria-hidden>
          {TOUR_STEPS.map((entry, index) => (
            <span
              key={entry.id}
              className={cn(
                "h-1 transition-all duration-300 ease-[var(--ease-out)]",
                index === step ? "bg-primary w-5" : "bg-foreground/25 w-2",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {step > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
              {t.common.back}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={close}>
              {t.common.skip}
            </Button>
          )}
          <Button size="sm" onClick={() => (last ? close() : setStep((s) => s + 1))}>
            {last ? t.common.done : t.common.next}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label={current.title(t)} className="animate-fade">
      {anchored ? (
        <div
          aria-hidden
          className="outline-primary pointer-events-none fixed z-50 outline-2 outline-offset-2 transition-all duration-300 ease-[var(--ease-out)]"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
          }}
        />
      ) : (
        <div aria-hidden className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm" />
      )}

      <div
        className={cn(
          "bg-background animate-rise fixed z-50 border",
          anchored
            ? "hidden w-[340px] sm:block"
            : "top-1/2 left-1/2 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2",
        )}
        style={anchored ? (card ?? undefined) : undefined}
      >
        {content}
      </div>

      {/* Below `sm` an anchored card has nowhere to sit, so it becomes a sheet
          pinned to the bottom while the highlight stays where it is. */}
      {anchored ? (
        <div className="bg-background animate-rise fixed inset-x-3 bottom-3 z-50 border sm:hidden">
          {content}
        </div>
      ) : null}
    </div>
  );
}
