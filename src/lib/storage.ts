"use client";

/**
 * localStorage-backed history and bookmarks.
 *
 * Deliberately client-only and backend-free: there are no accounts, so this is
 * the entire personalisation layer. Every read is SSR-guarded — these helpers
 * get imported by components that render on the server too.
 */

export type MediaKind = "anime" | "comic" | "movie" | "tv";

export type HistoryEntry = {
  kind: MediaKind;
  /** Stable identity, e.g. `anime:one-piece`. */
  id: string;
  title: string;
  href: string;
  poster?: string | null;
  /** "Episode 12", "Chapter 43", … */
  progress?: string | null;
  at: number;
};

export type BookmarkEntry = {
  kind: MediaKind;
  id: string;
  title: string;
  href: string;
  poster?: string | null;
  at: number;
};

const HISTORY_KEY = "natee.history.v1";
const BOOKMARK_KEY = "natee.bookmarks.v1";
const MAX_HISTORY = 40;
const MAX_BOOKMARKS = 300;

/** Fired after any write so open components can re-read without a reload. */
export const STORAGE_EVENT = "natee:storage";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  } catch {
    // Quota exceeded or storage disabled — history is a nicety, never fatal.
  }
}

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry>(HISTORY_KEY).sort((a, b) => b.at - a.at);
}

export function recordHistory(entry: Omit<HistoryEntry, "at">): void {
  const existing = read<HistoryEntry>(HISTORY_KEY).filter((item) => item.id !== entry.id);
  write(HISTORY_KEY, [{ ...entry, at: Date.now() }, ...existing].slice(0, MAX_HISTORY));
}

export function clearHistory(): void {
  write(HISTORY_KEY, []);
}

export function getBookmarks(): BookmarkEntry[] {
  return read<BookmarkEntry>(BOOKMARK_KEY).sort((a, b) => b.at - a.at);
}

export function isBookmarked(id: string): boolean {
  return read<BookmarkEntry>(BOOKMARK_KEY).some((item) => item.id === id);
}

/** Returns the state *after* toggling. */
export function toggleBookmark(entry: Omit<BookmarkEntry, "at">): boolean {
  const existing = read<BookmarkEntry>(BOOKMARK_KEY);
  const found = existing.some((item) => item.id === entry.id);

  if (found) {
    write(
      BOOKMARK_KEY,
      existing.filter((item) => item.id !== entry.id),
    );
    return false;
  }

  write(BOOKMARK_KEY, [{ ...entry, at: Date.now() }, ...existing].slice(0, MAX_BOOKMARKS));
  return true;
}
