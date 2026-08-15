import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Product tour steps.
 *
 * Each step points at a real element via `data-tour`, so the tour explains the
 * actual interface instead of describing it in the abstract. `target: null` is
 * an unanchored step — used for the opening and closing cards, which are about
 * the site as a whole rather than one control.
 *
 * A step whose target is missing (hidden at this breakpoint, or on a page that
 * does not render it) falls back to the same centred card. That is what keeps
 * an anchored tour from breaking the way spotlight tours usually do.
 */
export type TourStep = {
  id: string;
  target: string | null;
  title: (t: Dictionary) => string;
  body: (t: Dictionary) => string;
  /** Where the tour takes you if you follow the step. */
  href?: string;
};

export const TOUR_EVENT = "natee:tour";

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: "intro",
    target: null,
    title: (t) => t.tour.introTitle,
    body: (t) => t.tour.introBody,
  },
  {
    id: "anime",
    target: '[data-tour="nav-anime"]',
    title: (t) => t.tour.animeTitle,
    body: (t) => t.tour.animeBody,
    href: "/ongoing-anime/1",
  },
  {
    id: "comic",
    target: '[data-tour="nav-comic"]',
    title: (t) => t.tour.comicTitle,
    body: (t) => t.tour.comicBody,
    href: "/comic",
  },
  {
    id: "movie",
    target: '[data-tour="nav-movie"]',
    title: (t) => t.tour.movieTitle,
    body: (t) => t.tour.movieBody,
    href: "/movie",
  },
  {
    id: "more",
    target: '[data-tour="nav-more"]',
    title: (t) => t.tour.moreTitle,
    body: (t) => t.tour.moreBody,
    href: "/radio",
  },
  {
    id: "search",
    target: '[data-tour="search"]',
    title: (t) => t.tour.searchTitle,
    body: (t) => t.tour.searchBody,
  },
  {
    id: "bookmark",
    target: '[data-tour="bookmark"]',
    title: (t) => t.tour.bookmarkTitle,
    body: (t) => t.tour.bookmarkBody,
    href: "/bookmark",
  },
  {
    id: "language",
    target: '[data-tour="language"]',
    title: (t) => t.tour.languageTitle,
    body: (t) => t.tour.languageBody,
  },
  {
    id: "outro",
    target: null,
    title: (t) => t.tour.outroTitle,
    body: (t) => t.tour.outroBody,
  },
];

/** Ask the tour to start, from anywhere in the tree. */
export function startTour(): void {
  window.dispatchEvent(new Event(TOUR_EVENT));
}
