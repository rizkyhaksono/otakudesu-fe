"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useI18n } from "@/lib/i18n/client";
import type { SearchHit } from "@/types/api";

/**
 * Omnibox — one search box, every domain.
 *
 * Calls the same-origin `/api/search` proxy (never the backend directly:
 * `API_BASE_URL` is server-only) with a short debounce, and renders results
 * grouped by kind. Below the live results sit two static "search in…" links
 * that always work even with zero keystrokes typed yet or the backend down.
 */
export default function SearchTrigger() {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  // The query `hits` currently answers. Comparing it against the live query
  // *is* the loading state — nothing here calls `setState` synchronously
  // inside the effect, since it is only ever updated from the async callback.
  const [answeredQuery, setAnsweredQuery] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const trimmedQuery = query.trim();

  // Nothing typed: no request to make. `hits`/`answeredQuery` are simply not
  // consulted while empty (see `visibleHits`/`showLoading` below), so there is
  // nothing to reset here.
  useEffect(() => {
    if (!trimmedQuery) return;

    const id = ++requestId.current;

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: AbortSignal.timeout(6_000),
        });
        const payload = (await response.json()) as { data?: { hits: SearchHit[] } };
        // A stale response landing after a newer one must not overwrite it.
        if (id === requestId.current) {
          setHits(payload.data?.hits ?? []);
          setAnsweredQuery(trimmedQuery);
        }
      } catch {
        if (id === requestId.current) {
          setHits([]);
          setAnsweredQuery(trimmedQuery);
        }
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [trimmedQuery]);

  // Only render results once they actually answer the current query — a
  // result set from a query the user has since edited would be stale.
  const visibleHits = trimmedQuery && trimmedQuery === answeredQuery ? hits : [];
  const showLoading = trimmedQuery !== "" && trimmedQuery !== answeredQuery;

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const kindLabel: Record<SearchHit["kind"], string> = {
    anime: t.crumbs.anime,
    comic: t.crumbs.comic,
    movie: t.crumbs.movie,
    tv_series: t.crumbs.movie,
    radio: t.crumbs.radio,
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label={t.crumbs.search}
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" aria-hidden />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title={t.crumbs.search}>
        <div className="relative">
          <CommandInput
            placeholder={t.pages.search.placeholder}
            value={query}
            onValueChange={setQuery}
          />
          {showLoading ? (
            <Loader2
              className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin"
              aria-hidden
            />
          ) : null}
        </div>

        <CommandList>
          {trimmedQuery ? (
            visibleHits.length ? (
              <CommandGroup heading={t.common.resultsFor}>
                {visibleHits.map((hit) => (
                  <CommandItem
                    key={`${hit.kind}-${hit.href}`}
                    value={`${hit.kind} ${hit.title}`}
                    onSelect={() => go(hit.href)}
                    className="gap-2"
                  >
                    <span className="text-muted-foreground w-14 shrink-0 font-mono text-[0.65rem] uppercase">
                      {kindLabel[hit.kind]}
                    </span>
                    <span className="truncate">{hit.title}</span>
                    {hit.meta ? (
                      <span className="text-muted-foreground ml-auto shrink-0 font-mono text-[0.65rem]">
                        {hit.meta}
                      </span>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : !showLoading ? (
              <CommandEmpty>{t.pages.search.emptyTitle}</CommandEmpty>
            ) : null
          ) : (
            <CommandEmpty>{t.pages.search.placeholder}</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
