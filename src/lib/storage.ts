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
const PROGRESS_KEY = "natee.progress.v1";
const MAX_HISTORY = 40;
const MAX_BOOKMARKS = 300;
/** Per series. Enough to mark a long backlog without unbounded growth. */
const MAX_PARTS_PER_SERIES = 500;

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
  return migrate(read<HistoryEntry>(HISTORY_KEY)).sort((a, b) => b.at - a.at);
}

/**
 * History is keyed by *series*, never by episode or chapter.
 *
 * Reading chapter 4 and then chapter 22 of the same comic must update one card,
 * not create two — and with a 40-entry cap, per-chapter keys would also evict
 * every other series from the list after a single binge. Which chapters have
 * been read is tracked separately, by `markPartRead`.
 *
 * Fields are merged rather than overwritten so a page that knows less than the
 * previous one (a reader with no poster, say) cannot blank out what we had.
 */
export function recordHistory(entry: Omit<HistoryEntry, "at">): void {
  const all = migrate(read<HistoryEntry>(HISTORY_KEY));
  const previous = all.find((item) => item.id === entry.id);

  const merged: HistoryEntry = {
    ...previous,
    ...entry,
    poster: entry.poster ?? previous?.poster ?? null,
    progress: entry.progress ?? previous?.progress ?? null,
    at: Date.now(),
  };

  write(
    HISTORY_KEY,
    [merged, ...all.filter((item) => item.id !== entry.id)].slice(0, MAX_HISTORY),
  );
}

/**
 * Collapse legacy per-part entries (`comic:slug:12`) onto their series, keeping
 * the most recent one. Runs on read so existing installs heal themselves
 * without a separate migration step.
 */
function migrate(entries: HistoryEntry[]): HistoryEntry[] {
  const byId = new Map<string, HistoryEntry>();
  let changed = false;

  for (const entry of entries) {
    const parts = entry.id.split(":");
    const id = parts.length > 2 ? parts.slice(0, 2).join(":") : entry.id;
    if (id !== entry.id) changed = true;

    const existing = byId.get(id);
    if (!existing || entry.at > existing.at) {
      byId.set(id, { ...entry, id, poster: entry.poster ?? existing?.poster ?? null });
    } else {
      changed = true;
    }
  }

  const result = [...byId.values()];
  if (changed) write(HISTORY_KEY, result);
  return result;
}

/**
 * Which parts of a series have been opened, kept apart from history.
 *
 * Stored as `{ "comic:slug": [4, 22, 23] }` — compact, and it survives history
 * being trimmed or cleared, which is what makes read-markers reliable on a
 * 300-chapter series.
 */
type ProgressMap = Record<string, number[]>;

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getReadParts(seriesId: string): Set<number> {
  return new Set(readProgress()[seriesId] ?? []);
}

export function markPartRead(seriesId: string, part: number): void {
  if (typeof window === "undefined" || !Number.isFinite(part)) return;

  const map = readProgress();
  const current = map[seriesId] ?? [];
  if (current.includes(part)) return;

  map[seriesId] = [...current, part].sort((a, b) => a - b).slice(-MAX_PARTS_PER_SERIES);

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  } catch {
    // Storage full or disabled — markers are a nicety, never fatal.
  }
}

export function clearHistory(): void {
  write(HISTORY_KEY, []);
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // ignore
  }
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
