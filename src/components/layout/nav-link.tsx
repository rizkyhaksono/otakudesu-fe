"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Top-level nav link that marks itself active for the current section. */
export default function NavLinkItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "press relative px-3 py-2 text-sm font-medium",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {/* Flat underline rather than a pill — consistent with the squared system. */}
      <span
        className={cn(
          "bg-primary absolute inset-x-3 -bottom-px h-0.5 origin-left transition-transform duration-200 ease-[var(--ease-out)]",
          active ? "scale-x-100" : "scale-x-0",
        )}
        aria-hidden
      />
    </Link>
  );
}
