"use client";

import { getBookmarks, type BookmarkEntry } from "@/lib/storage";
import { useStoredValue } from "@/hooks/use-storage";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import EmptyState from "@/components/media/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import EntryThumb from "@/components/history/entry-thumb";
import { useI18n } from "@/lib/i18n/client";

export default function BookmarkList() {
  const { t } = useI18n();
  const [bookmarks, mounted] = useStoredValue<BookmarkEntry[]>(getBookmarks, []);

  const kindLabel: Record<BookmarkEntry["kind"], string> = {
    anime: t.crumbs.anime,
    comic: t.crumbs.comic,
    movie: t.crumbs.movie,
    tv: t.crumbs.tv,
    radio: t.crumbs.radio,
  };

  if (!mounted) {
    return (
      <PosterGrid>
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="p-2">
            <Skeleton className="aspect-[2/3] w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </div>
        ))}
      </PosterGrid>
    );
  }

  if (!bookmarks.length) {
    return (
      <EmptyState
        title={t.pages.bookmark.emptyTitle}
        description={t.pages.bookmark.emptyBody}
        action={{ href: "/", label: t.pages.bookmark.start }}
      />
    );
  }

  return (
    <PosterGrid>
      {bookmarks.map((entry) => (
        <PosterCard
          key={entry.id}
          href={entry.href}
          title={entry.title}
          poster={entry.poster}
          badge={kindLabel[entry.kind]}
          fallback={<EntryThumb kind={entry.kind} poster={null} title={entry.title} />}
        />
      ))}
    </PosterGrid>
  );
}
