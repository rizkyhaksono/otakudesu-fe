"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Poster image with a graceful failure state.
 *
 * Upstream CDNs move between subdomains and delete files, and `next/image`
 * rejects any host outside the allowlist. Either way the browser's default is a
 * broken-image icon next to raw alt text, which looks like a bug. This falls
 * back to a neutral tile instead, and fades in on load so the grid does not
 * flash.
 */
export default function PosterImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="bg-muted text-muted-foreground/60 absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.25">
          <path d="M3 4h18v16H3z" />
          <path d="m3 16 5-5 4 4 3-3 6 6" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn(
        "object-cover transition-[opacity,filter,transform] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
