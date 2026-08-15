import Link from "next/link";
import type { NewsItem } from "@/types/api";
import { formatNewsDate } from "@/lib/date";

/**
 * Compact headline list, used wherever news appears next to other content —
 * an anime page, the homepage — as opposed to the full grid on `/berita`.
 */
export default function NewsList({ items, title }: { items: NewsItem[]; title?: string }) {
  if (!items.length) return null;

  return (
    <div className="border">
      {title ? <p className="eyebrow border-b p-3">{title}</p> : null}
      <ul>
        {items.map((item) => (
          <li key={item.id} className="border-b last:border-b-0">
            <Link
              href={`/berita/${item.id}`}
              className="hover:bg-accent group block p-3 transition-colors"
            >
              <span className="text-muted-foreground flex items-center gap-2 font-mono text-[0.65rem] uppercase">
                {item.category ? <span className="text-primary">{item.category}</span> : null}
                {item.published_at ? (
                  <time dateTime={item.published_at}>{formatNewsDate(item.published_at)}</time>
                ) : null}
              </span>
              <span className="group-hover:text-primary mt-1 block text-sm font-medium text-balance">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
