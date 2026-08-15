"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/client";

/** Top-level nav link that marks itself active for the current section. */
export default function NavLinkItem({
  href,
  label,
  navKey,
}: {
  href: string;
  label: string;
  /** Key into `dictionary.nav`; falls back to the Indonesian label. */
  navKey?: string;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const text = (navKey && (t.nav as Record<string, string>)[navKey]) || label;
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
      {text}
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
