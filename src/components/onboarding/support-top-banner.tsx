"use client";

import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { SAWERIA } from "@/lib/onboarding";

const REPEATS_PER_GROUP = 8;

function MarqueeGroup({ text, duplicate }: { text: string; duplicate?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {Array.from({ length: REPEATS_PER_GROUP }, (_, i) => (
        <span key={i} className="inline-flex shrink-0 items-center text-sm font-medium leading-none">
          <span>{text}</span>
          <span className="mx-5 opacity-75" aria-hidden>·</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Permanent Saweria strip — calm, centered marquee like saweria.co’s own promo bar.
 */
export default function SupportTopBanner() {
  const { t } = useI18n();
  const label = t.support.banner.trim();

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
        className="press group relative flex h-10 items-center hover:opacity-95 sm:h-9"
      >
        <span className="sr-only">{t.support.donate}</span>

        <div className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden pr-11 motion-reduce:hidden">
          <div className="flex w-max animate-support-marquee items-center py-0.5">
            <MarqueeGroup text={label} />
            <MarqueeGroup text={label} duplicate />
          </div>
        </div>

        <span
          className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center bg-primary pl-1"
          aria-hidden
        >
          <ExternalLink className="size-3.5 opacity-90 transition-opacity group-hover:opacity-100" />
        </span>

        <p className="hidden w-full truncate px-4 text-center text-sm font-medium motion-reduce:block">
          {label}
        </p>
      </a>
    </div>
  );
}
