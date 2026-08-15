"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Used where the server genuinely cannot know the value (resolved theme,
 * localStorage) so the markup stays identical until hydration finishes.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
