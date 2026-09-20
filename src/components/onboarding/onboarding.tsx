"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { hasSeenSupport } from "@/lib/onboarding";
import SupportPrompt from "./support-prompt";
import SupportTopBanner from "./support-top-banner";
import ProductTour from "./product-tour";

/**
 * Sequences support UI and the product tour: modal first (once), then a top
 * Saweria banner, then the tour only after support is out of the way.
 */
export default function SupportOnboarding({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [supportDone, setSupportDone] = useState(false);
  const showBanner = mounted && (hasSeenSupport() || supportDone);
  const tourActive = mounted && (hasSeenSupport() || supportDone);

  return (
    <>
      {showBanner ? <SupportTopBanner /> : null}
      {children}
      <SupportPrompt onDismiss={() => setSupportDone(true)} />
      <ProductTour active={tourActive} />
    </>
  );
}
