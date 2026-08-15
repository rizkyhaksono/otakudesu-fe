"use client";

import { getBookmarks, type BookmarkEntry } from "@/lib/storage";
import { useStoredValue } from "@/hooks/use-storage";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import EmptyState from "@/components/media/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

const KIND_LABEL: Record<BookmarkEntry["kind"], string> = {
  anime: "Anime",
  comic: "Komik",
  movie: "Film",
  tv: "TV",
  radio: "Radio",
};

export default function BookmarkList() {
  const [bookmarks, mounted] = useStoredValue<BookmarkEntry[]>(getBookmarks, []);

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
        title="Belum ada bookmark"
        description="Simpan anime, komik atau film lewat tombol Bookmark di halaman detailnya."
        action={{ href: "/", label: "Mulai jelajahi" }}
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
          badge={KIND_LABEL[entry.kind]}
        />
      ))}
    </PosterGrid>
  );
}
