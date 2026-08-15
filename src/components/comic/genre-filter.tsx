import Link from "next/link";
import type { ComicGenre } from "@/types/api";
import SearchForm from "@/components/search/search-form";
import { cn } from "@/lib/utils";

/**
 * Plain links, not a client-side filter: each genre is its own crawlable URL,
 * and the whole control works without JavaScript.
 */
export default function GenreFilter({
  genres,
  active,
  query,
}: {
  genres: ComicGenre[];
  active?: string;
  query?: string;
}) {
  if (!genres.length && !query) return null;

  const href = (genre?: string) => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (query) params.set("q", query);
    const search = params.toString();
    return `/comic/browse${search ? `?${search}` : ""}`;
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="max-w-md">
        <SearchForm action="/comic/browse" placeholder="Cari judul komik…" defaultValue={query} />
      </div>

      {genres.length ? (
        <nav aria-label="Filter genre" className="flex flex-wrap gap-px bg-border [&>*]:bg-background">
          <Link
            href={href()}
            className={cn(
              "press px-3 py-1.5 font-mono text-xs uppercase",
              !active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
            )}
          >
            Semua
          </Link>
          {genres.map((genre) => (
            <Link
              key={genre.slug}
              href={href(genre.slug)}
              className={cn(
                "press flex items-center gap-1 px-3 py-1.5 font-mono text-xs uppercase",
                active === genre.slug
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "hover:bg-accent",
              )}
            >
              {genre.icon ? <span aria-hidden>{genre.icon}</span> : null}
              {genre.name}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
