"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { isBookmarked, toggleBookmark, type BookmarkEntry } from "@/lib/storage";
import { useStoredValue } from "@/hooks/use-storage";
import { Button } from "@/components/ui/button";

export default function BookmarkButton(entry: Omit<BookmarkEntry, "at">) {
  const [saved, mounted] = useStoredValue<boolean>(() => isBookmarked(entry.id), false);

  const onClick = () => {
    const next = toggleBookmark(entry);
    toast(next ? "Ditambahkan ke bookmark" : "Dihapus dari bookmark");
  };

  return (
    <Button variant={saved ? "default" : "outline"} onClick={onClick} className="gap-2">
      {mounted && saved ? (
        <BookmarkCheck className="size-4" aria-hidden />
      ) : (
        <Bookmark className="size-4" aria-hidden />
      )}
      {mounted && saved ? "Tersimpan" : "Bookmark"}
    </Button>
  );
}
