"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_EVENT } from "@/lib/storage";

/**
 * Subscribe to localStorage the way React intends.
 *
 * `useSyncExternalStore` is built for exactly this: an external mutable source
 * that also has to render on the server. The server snapshot is the caller's
 * `initial`, so the first client render matches the HTML and hydration stays
 * clean — no setState-in-effect, no flash.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * `read` must return a referentially stable value for unchanged data —
 * `useSyncExternalStore` compares snapshots with `Object.is`. Cache the last
 * serialised form so repeated reads of the same data do not loop.
 */
export function useStoredValue<T>(read: () => T, initial: T): [T, boolean] {
  const cache = getCache<T>(read);

  const value = useSyncExternalStore(
    subscribe,
    cache.getSnapshot,
    () => initial, // server + first client render
  );

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return [mounted ? value : initial, mounted];
}

type Cache<T> = { getSnapshot: () => T };

const caches = new WeakMap<() => unknown, Cache<unknown>>();

function getCache<T>(read: () => T): Cache<T> {
  const existing = caches.get(read);
  if (existing) return existing as Cache<T>;

  let lastKey: string | undefined;
  let lastValue: T;

  const cache: Cache<T> = {
    getSnapshot() {
      const next = read();
      const key = serialise(next);
      if (key !== lastKey) {
        lastKey = key;
        lastValue = next;
      }
      return lastValue;
    },
  };

  caches.set(read, cache as Cache<unknown>);
  return cache;
}

function serialise(value: unknown): string {
  if (value instanceof Set) return JSON.stringify([...value].sort());
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
