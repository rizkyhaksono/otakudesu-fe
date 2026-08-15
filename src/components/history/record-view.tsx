"use client";

import { useEffect } from "react";
import { recordHistory, type HistoryEntry } from "@/lib/storage";

/**
 * Drop-in on any detail/reader/watch page to record it in history.
 * Renders nothing — it exists so the surrounding page can stay a Server Component.
 */
export default function RecordView(entry: Omit<HistoryEntry, "at">) {
  useEffect(() => {
    recordHistory(entry);
    // Re-record when the identity or progress changes (e.g. next episode).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id, entry.progress]);

  return null;
}
