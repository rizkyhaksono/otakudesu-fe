"use client";

import { useState } from "react";
import SupportPrompt from "./support-prompt";
import FeatureTour from "./feature-tour";

/**
 * Sequences the two one-time overlays: support prompt first, tour only once it
 * has been dismissed. Showing both at once would stack two dialogs on a
 * first-time visitor.
 */
export default function Onboarding() {
  const [supportDone, setSupportDone] = useState(false);

  return (
    <>
      <SupportPrompt onDismiss={() => setSupportDone(true)} />
      <FeatureTour active={supportDone} />
    </>
  );
}
