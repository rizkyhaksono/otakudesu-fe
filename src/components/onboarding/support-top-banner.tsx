"use client";

import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { SAWERIA } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

/**
 * Permanent Saweria strip after the one-time support modal has been dismissed.
 * Sits above the header so every return visit still has a quiet path to donate.
 */
export default function SupportTopBanner() {
  const { t } = useI18n();
  const label = t.support.banner;

  return (
    <div
      className="bg-primary text-primary-foreground relative z-50 overflow-hidden border-b border-primary-foreground/15"
      role="region"
      aria-label={t.support.docked}
    >
      <a
        href={SAWERIA}
        target="_blank"
        rel="noopener noreferrer"
        className="press flex h-9 items-center gap-2 hover:opacity-95 motion-reduce:justify-center sm:h-8"
      >
        <span className="sr-only">{t.support.donate}</span>
        <div className="flex min-w-0 flex-1 overflow-hidden motion-reduce:hidden">
          <div className={cn("flex w-max shrink-0 animate-support-marquee items-center whitespace-nowrap")}>
            <span className="font-mono text-[0.7rem] tracking-wide uppercase sm:text-xs">{label}</span>
            <span className="font-mono text-[0.7rem] tracking-wide uppercase sm:text-xs" aria-hidden>
              {label}
            </span>
          </div>
        </div>
        <span
          className="hidden min-w-0 flex-1 truncate px-4 text-center font-mono text-[0.7rem] tracking-wide uppercase motion-reduce:inline sm:text-xs"
        >
          {label.trim()}
        </span>
        <ExternalLink className="mx-3 size-3.5 shrink-0 motion-reduce:inline sm:mx-4" aria-hidden />
      </a>
    </div>
  );
}
