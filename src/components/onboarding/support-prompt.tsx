"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { Coffee, Heart, Star, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { hasSeenSupport, markSupportSeen, REPOS, SAWERIA } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";

/**
 * Support prompt: a Saweria-focused modal exactly once per browser.
 *
 * The modal is deliberately delayed rather than shown on paint — interrupting
 * someone before they have seen the page is what makes this pattern feel like
 * an ad. Once dismissed it never returns; a top marquee banner takes over.
 */
export default function SupportPrompt({ onDismiss }: { onDismiss?: () => void }) {
  const { t } = useI18n();
  const mounted = useMounted();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const seen = mounted ? hasSeenSupport() : true;
  const open = mounted && !seen && !dismissed && showModal;

  useEffect(() => {
    if (!mounted || seen || dismissed) return;
    const timer = window.setTimeout(() => setShowModal(true), 2500);
    return () => window.clearTimeout(timer);
  }, [mounted, seen, dismissed]);

  const dismiss = () => {
    markSupportSeen();
    setDismissed(true);
    setShowModal(false);
    onDismiss?.();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
      className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
    >
      <div className="bg-background animate-rise w-full max-w-md border">
        <div className="flex items-start justify-between border-b p-4">
          <p className="eyebrow flex items-center gap-1.5">
            <Heart className="text-primary size-3.5" aria-hidden />
            {t.support.eyebrow}
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t.common.close}
            className="press hover:bg-accent -m-1 p-1"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="p-5">
          <h2 id="support-title" className="font-display text-2xl font-extrabold tracking-tight uppercase">
            {t.support.title}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{t.support.body}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild className="gap-2">
              <a href={SAWERIA} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
                <Coffee className="size-4" aria-hidden />
                {t.support.donate}
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href={REPOS.frontend} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
                <Star className="size-4 fill-current" aria-hidden />
                {t.support.star}
              </a>
            </Button>
            <Button variant="ghost" onClick={dismiss}>
              {t.support.later}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
