import Link from "next/link";
import type { ComicGenre } from "@/types/api";
import SearchForm from "@/components/search/search-form";
import { cn } from "@/lib/utils";

const TYPES = ["Manga", "Manhwa", "Manhua"] as const;
const SORTS = [
  { value: "latest", label: "Terbaru" },
  { value: "popular", label: "Populer" },
] as const;

/**
 * Plain links, not client-side state: every combination is its own crawlable
 * URL and the whole control works with JavaScript disabled.
 */
export default function CatalogueFilters({
  genres,
  active,
}: {
  genres: ComicGenre[];
  active: { genre?: string; type?: string; sort?: string; q?: string };
}) {
  const href = (patch: Partial<typeof active>) => {
    const next = { ...active, ...patch };
    const params = new URLSearchParams();
    for (const key of ["q", "type", "sort", "genre"] as const) {
      const value = next[key];
      if (value) params.set(key, value);
    }
    const query = params.toString();
    return `/comic/browse${query ? `?${query}` : ""}`;
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="max-w-md">
        <SearchForm action="/comic/browse" placeholder="Cari judul komik…" defaultValue={active.q} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Row label="Urutkan">
          <Chip href={href({ sort: undefined })} on={!active.sort}>
            Default
          </Chip>
          {SORTS.map((sort) => (
            <Chip key={sort.value} href={href({ sort: sort.value })} on={active.sort === sort.value}>
              {sort.label}
            </Chip>
          ))}
        </Row>

        <Row label="Tipe">
          <Chip href={href({ type: undefined })} on={!active.type}>
            Semua
          </Chip>
          {TYPES.map((type) => (
            <Chip key={type} href={href({ type })} on={active.type === type}>
              {type}
            </Chip>
          ))}
          <Chip href="/comic/novels" on={false}>
            Novel
          </Chip>
        </Row>
      </div>

      {genres.length ? (
        <Row label="Genre">
          <Chip href={href({ genre: undefined })} on={!active.genre}>
            Semua
          </Chip>
          {genres.map((genre) => (
            <Chip key={genre.slug} href={href({ genre: genre.slug })} on={active.genre === genre.slug}>
              {genre.icon ? <span aria-hidden>{genre.icon}</span> : null}
              {genre.name}
            </Chip>
          ))}
        </Row>
      ) : null}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="eyebrow mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-px bg-border [&>*]:bg-background">{children}</div>
    </div>
  );
}

function Chip({
  href,
  on,
  children,
}: {
  href: string;
  on: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "press flex items-center gap-1 px-3 py-1.5 font-mono text-xs uppercase",
        on ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}
