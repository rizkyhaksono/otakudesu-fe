"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";

/**
 * A client component only so the "see all" label can be translated without
 * every one of the twenty call sites having to thread it through. The heading
 * and the grid it wraps are still rendered on the server and passed in.
 */
export default function Section({
  title,
  eyebrow,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-3 flex items-end justify-between gap-4 border-b pb-2">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="font-display text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            {title}
          </h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="text-muted-foreground hover:text-primary flex shrink-0 items-center gap-1 pb-1 font-mono text-xs uppercase transition-colors"
          >
            {hrefLabel ?? t.common.seeAll}
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
