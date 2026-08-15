import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Path-based pagination (`/ongoing-anime/3`) rather than `?page=3`.
 *
 * Search engines treat these as distinct documents, and it avoids needing
 * `useSearchParams`, which would force the whole route to render on the client.
 */
export default function Pager({
  current,
  last,
  href,
}: {
  current: number;
  last: number;
  href: (page: number) => string;
}) {
  if (last <= 1) return null;

  const window = 2;
  const pages: number[] = [];
  for (let page = Math.max(1, current - window); page <= Math.min(last, current + window); page++) {
    pages.push(page);
  }

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center">
      <ul className="flex items-center gap-px border bg-border [&>*]:bg-background">
        <li>
          <PagerLink href={href(current - 1)} disabled={current <= 1} label="Sebelumnya">
            <ChevronLeft className="size-4" aria-hidden />
          </PagerLink>
        </li>

        {pages[0]! > 1 ? (
          <>
            <li>
              <PagerLink href={href(1)}>1</PagerLink>
            </li>
            {pages[0]! > 2 ? (
              <li className="text-muted-foreground px-2 font-mono text-xs">…</li>
            ) : null}
          </>
        ) : null}

        {pages.map((page) => (
          <li key={page}>
            <PagerLink href={href(page)} active={page === current}>
              {page}
            </PagerLink>
          </li>
        ))}

        {pages[pages.length - 1]! < last ? (
          <>
            {pages[pages.length - 1]! < last - 1 ? (
              <li className="text-muted-foreground px-2 font-mono text-xs">…</li>
            ) : null}
            <li>
              <PagerLink href={href(last)}>{last}</PagerLink>
            </li>
          </>
        ) : null}

        <li>
          <PagerLink href={href(current + 1)} disabled={current >= last} label="Berikutnya">
            <ChevronRight className="size-4" aria-hidden />
          </PagerLink>
        </li>
      </ul>
    </nav>
  );
}

function PagerLink({
  href,
  children,
  active = false,
  disabled = false,
  label,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  const className = cn(
    "flex h-9 min-w-9 items-center justify-center px-3 font-mono text-xs tabular-nums transition-colors",
    active && "bg-primary text-primary-foreground font-semibold",
    !active && !disabled && "hover:bg-accent",
    disabled && "text-muted-foreground/40 pointer-events-none",
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled aria-label={label}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-label={label} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
