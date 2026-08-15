"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Bookmark, Clapperboard, Play, Radio, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { hasSeenTour, markTourSeen } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A short welcome tour, shown once, after the support prompt is dismissed.
 *
 * Deliberately not a spotlight-on-real-elements tour: those break the moment
 * the layout changes or the element is off-screen on mobile. This is a
 * self-contained card that explains what the site holds and links straight to
 * each area, so it works identically at every viewport.
 */
export default function FeatureTour({ active }: { active: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Play, title: t.tour.step1Title, body: t.tour.step1Body, href: "/ongoing-anime/1" },
    { icon: BookOpen, title: t.tour.step2Title, body: t.tour.step2Body, href: "/comic" },
    { icon: Clapperboard, title: t.tour.step3Title, body: t.tour.step3Body, href: "/movie" },
    { icon: Radio, title: t.tour.step4Title, body: t.tour.step4Body, href: "/tv" },
    { icon: Bookmark, title: t.tour.step5Title, body: t.tour.step5Body, href: "/bookmark" },
  ];

  const finish = () => {
    markTourSeen();
    setOpen(false);
  };

  useEffect(() => {
    if (!active || hasSeenTour()) return;
    const timer = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key === "ArrowRight") setStep((s) => Math.min(steps.length - 1, s + 1));
      if (event.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
     
  }, [open, steps.length]);

  if (!open) return null;

  const current = steps[step]!;
  const Icon = current.icon;
  const last = step === steps.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
    >
      <div className="bg-background animate-rise w-full max-w-lg border">
        <div className="flex items-center justify-between border-b p-4">
          <p className="eyebrow">{t.tour.title}</p>
          <button
            type="button"
            onClick={finish}
            aria-label={t.common.close}
            className="press hover:bg-accent -m-1 p-1"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="flex gap-4 p-5">
          <span className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center">
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 id="tour-title" className="font-display text-xl font-extrabold tracking-tight uppercase">
              {current.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{current.body}</p>
            <Link
              href={current.href}
              onClick={finish}
              className="text-primary press mt-3 inline-block font-mono text-xs uppercase"
            >
              {t.common.seeAll} →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <div className="flex gap-1.5" role="tablist" aria-label={t.tour.title}>
            {steps.map((entry, index) => (
              <button
                key={entry.title}
                type="button"
                role="tab"
                aria-selected={index === step}
                aria-label={entry.title}
                onClick={() => setStep(index)}
                className={cn(
                  "h-1 transition-all duration-300 ease-[var(--ease-out)]",
                  index === step ? "bg-primary w-6" : "bg-foreground/25 hover:bg-foreground/50 w-3",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={finish}>
              {last ? t.common.done : t.common.skip}
            </Button>
            {!last ? (
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                {t.common.next}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
