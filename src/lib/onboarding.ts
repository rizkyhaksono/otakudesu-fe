"use client";

/**
 * One-time onboarding state.
 *
 * Both the support prompt and the feature tour must appear exactly once per
 * browser and never again — including across refreshes — so the flags live in
 * localStorage rather than in React state or a session cookie.
 */

const SUPPORT_KEY = "natee.support.seen.v1";
const TOUR_KEY = "natee.tour.seen.v1";

function read(key: string): boolean {
  if (typeof window === "undefined") return true; // never flash during SSR
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    // Storage blocked: treat as already seen so we cannot nag on every load.
    return true;
  }
}

function mark(key: string): void {
  try {
    localStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export const hasSeenSupport = () => read(SUPPORT_KEY);
export const markSupportSeen = () => mark(SUPPORT_KEY);
export const hasSeenTour = () => read(TOUR_KEY);
export const markTourSeen = () => mark(TOUR_KEY);

export const REPOS = {
  frontend: "https://github.com/rizkyhaksono/otakudesu-fe",
  backend: "https://github.com/rizkyhaksono/otakudesu-be",
};
