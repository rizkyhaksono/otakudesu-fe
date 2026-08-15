"use client";

import { Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { startTour } from "@/lib/tour";

/**
 * Replays the product tour.
 *
 * A one-time tour that can never be seen again is a dead end for anyone who
 * skipped it, so it stays reachable from the footer for the life of the site.
 */
export default function TourTrigger() {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={startTour}
      className="text-muted-foreground hover:text-foreground press inline-flex items-center gap-1.5 text-sm"
    >
      <Compass className="size-3.5" aria-hidden />
      {t.tour.replay}
    </button>
  );
}
