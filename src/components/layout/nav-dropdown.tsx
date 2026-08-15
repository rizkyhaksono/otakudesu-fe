"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Dropdown for a nav group.
 *
 * The panel is always in the DOM (hidden with CSS, not unmounted) so its links
 * stay in the server-rendered HTML for crawlers, and so opening it costs no
 * layout work.
 */
export default function NavDropdown({ label, items }: { label: string; items: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const menuId = useId();

  const active = items.some((item) => pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href));

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "press flex items-center gap-1 px-3 py-2 text-sm font-medium",
          active || open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200 ease-[var(--ease-out)]",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={menuId}
        className={cn(
          "bg-popover absolute top-full left-0 w-72 border transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <ul>
          {items.map((item) => (
            <li key={item.href} className="border-b last:border-b-0">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="hover:bg-accent press block px-3 py-2.5"
              >
                <span className="block text-sm font-medium">{item.label}</span>
                {item.description ? (
                  <span className="text-muted-foreground block text-xs">{item.description}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
