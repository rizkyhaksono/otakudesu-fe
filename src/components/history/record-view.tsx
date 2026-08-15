"use client";

import { useEffect } from "react";
import { markPartRead, recordHistory, type HistoryEntry } from "@/lib/storage";

/**
 * Drop-in on any detail/reader/watch page to record it in history.
 * Renders nothing — it exists so the surrounding page can stay a Server Component.
 *
 * `id` must identify the *series*, not the episode or chapter; pass the part
 * number as `part` so the chapter list can mark it read without polluting the
 * "continue" rail with one card per chapter.
 */
export default function RecordView({
  part,
  ...entry
}: Omit<HistoryEntry, "at"> & { part?: number | null }) {
  useEffect(() => {
    recordHistory(entry);
    if (typeof part === "number") markPartRead(entry.id, part);
    // Re-record when the identity or progress changes (e.g. the next episode).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id, entry.progress, part]);

  return null;
}
