"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { GitFork, Heart, Star, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { hasSeenSupport, markSupportSeen, REPOS } from "@/lib/onboarding";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "hidden" | "modal" | "docked";

/**
 * Support prompt: a modal exactly once per browser, then a permanent dock.
 *
 * The modal is deliberately delayed rather than shown on paint — interrupting
 * someone before they have seen the page is what makes this pattern feel like
 * an ad. Once dismissed it never returns; the dock remains as a quiet,
 * always-available way back.
 */
export default function SupportPrompt({ onDismiss }: { onDismiss?: () => void }) {
  const { t } = useI18n();
  const mounted = useMounted();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // `hasSeenSupport` reads localStorage, so it is only meaningful after mount.
  // Deriving the phase instead of assigning it in an effect keeps this clear of
  // React 19's setState-in-effect rule and of hydration mismatches.
  const seen = mounted ? hasSeenSupport() : true;
  const phase: Phase = !mounted ? "hidden" : showModal && !dismissed ? "modal" : "docked";

  useEffect(() => {
    if (!mounted || seen || dismissed) return;
    // Async by construction — the rule only forbids a *synchronous* setState.
    const timer = window.setTimeout(() => setShowModal(true), 2500);
    return () => window.clearTimeout(timer);
  }, [mounted, seen, dismissed]);

  const dismiss = () => {
    markSupportSeen();
    setDismissed(true);
    setShowModal(false);
    onDismiss?.();
  };

  // Escape closes it, like any other dialog.
  useEffect(() => {
    if (phase !== "modal") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === "hidden") return null;

  if (phase === "docked") {
    return (
      <a
        href={REPOS.frontend}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.support.docked}
        title={t.support.docked}
        className={cn(
          "bg-primary text-primary-foreground press animate-fade fixed right-0 bottom-24 z-40",
          "flex items-center gap-2 border py-3 pr-2 pl-3 shadow-none",
          "[writing-mode:vertical-rl] hover:pr-3",
        )}
      >
        <Star className="size-3.5 rotate-90 fill-current" aria-hidden />
        <span className="font-mono text-[0.7rem] tracking-widest uppercase">
          {t.support.docked}
        </span>
      </a>
    );
  }

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
            Open source · MIT
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
              <a href={REPOS.frontend} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
                <Star className="size-4 fill-current" aria-hidden />
                {t.support.star}
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href={`${REPOS.frontend}/fork`} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
                <GitFork className="size-4" aria-hidden />
                {t.support.fork}
              </a>
            </Button>
            <Button variant="ghost" onClick={dismiss}>
              {t.support.later}
            </Button>
          </div>

          <p className="text-muted-foreground mt-4 font-mono text-[0.7rem]">
            frontend · backend — {t.support.docked.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
