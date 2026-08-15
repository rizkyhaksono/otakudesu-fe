import { beforeEach, describe, expect, test } from "bun:test";

/**
 * `src/lib/storage.ts` is a client module, so give it the two browser globals
 * it touches before importing.
 */
const store = new Map<string, string>();

(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, value),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
  key: (index: number) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
} as Storage;

(globalThis as unknown as { window: unknown }).window = globalThis;
globalThis.dispatchEvent ??= (() => true) as typeof globalThis.dispatchEvent;

const { getBookmarks, getHistory, isBookmarked, recordHistory, toggleBookmark, clearHistory } =
  await import("@/lib/storage");

beforeEach(() => store.clear());

describe("history", () => {
  test("records newest first and de-duplicates by id", () => {
    recordHistory({ kind: "anime", id: "a", title: "A", href: "/a" });
    recordHistory({ kind: "comic", id: "b", title: "B", href: "/b" });
    recordHistory({ kind: "anime", id: "a", title: "A2", href: "/a2", progress: "Eps 3" });

    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]!.id).toBe("a");
    expect(history[0]!.title).toBe("A2");
    expect(history[0]!.progress).toBe("Eps 3");
  });

  test("caps the number of entries", () => {
    for (let i = 0; i < 60; i++) {
      recordHistory({ kind: "anime", id: `id-${i}`, title: `T${i}`, href: `/${i}` });
    }
    expect(getHistory().length).toBeLessThanOrEqual(40);
  });

  test("clears", () => {
    recordHistory({ kind: "anime", id: "a", title: "A", href: "/a" });
    clearHistory();
    expect(getHistory()).toHaveLength(0);
  });

  test("survives corrupted storage", () => {
    store.set("natee.history.v1", "{not json");
    expect(getHistory()).toEqual([]);
  });
});

describe("bookmarks", () => {
  test("toggles on and off", () => {
    const entry = { kind: "comic" as const, id: "c:1", title: "C", href: "/c" };

    expect(toggleBookmark(entry)).toBe(true);
    expect(isBookmarked("c:1")).toBe(true);
    expect(getBookmarks()).toHaveLength(1);

    expect(toggleBookmark(entry)).toBe(false);
    expect(isBookmarked("c:1")).toBe(false);
    expect(getBookmarks()).toHaveLength(0);
  });
});
