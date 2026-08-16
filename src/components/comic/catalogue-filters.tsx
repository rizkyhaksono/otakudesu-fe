"use client";

import Link from "next/link";
import type { ComicGenre } from "@/types/api";
import SearchForm from "@/components/search/search-form";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/client";

const TYPES = ["Manga", "Manhwa", "Manhua"] as const;
const SORTS = ["latest", "popular"] as const;

/*
 * The hairline grid paints `bg-border` on the container and a background on
 * each cell. The background must come from the cell's own class list, not a
 * `[&>*]:bg-background` on the container: that compiles to `.parent > *`, which
 * outranks `bg-primary` on the child and silently repainted every active chip
 * with the page background — the selected filter turned invisible.
 */

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
  const { t } = useI18n();
  const sortLabel = { latest: t.pages.comicBrowse.newest, popular: t.pages.comicBrowse.mostPopular };

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
        <SearchForm
          action="/comic/browse"
          placeholder={t.pages.comicBrowse.searchPlaceholder}
          defaultValue={active.q}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Row label={t.pages.comicBrowse.sort}>
          <Chip href={href({ sort: undefined })} on={!active.sort}>
            {t.pages.comicBrowse.default}
          </Chip>
          {SORTS.map((sort) => (
            <Chip key={sort} href={href({ sort })} on={active.sort === sort}>
              {sortLabel[sort]}
            </Chip>
          ))}
        </Row>

        <Row label={t.pages.comicBrowse.type}>
          <Chip href={href({ type: undefined })} on={!active.type}>
            {t.pages.comicBrowse.all}
          </Chip>
          {TYPES.map((type) => (
            <Chip key={type} href={href({ type })} on={active.type === type}>
              {type}
            </Chip>
          ))}
          <Chip href="/comic/novels" on={false}>
            {t.crumbs.novels}
          </Chip>
        </Row>
      </div>

      {genres.length ? (
        <Row label={t.pages.comicBrowse.genre}>
          <Chip href={href({ genre: undefined })} on={!active.genre}>
            {t.pages.comicBrowse.all}
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
      <div className="flex flex-wrap gap-px bg-border">{children}</div>
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
        on
          ? "bg-primary text-primary-foreground font-semibold"
          : "bg-background hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}
