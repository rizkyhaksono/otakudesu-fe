"use client";

import { useState } from "react";
import SupportPrompt from "./support-prompt";
import ProductTour from "./product-tour";

/**
 * Sequences the two one-time overlays: support prompt first, the product tour only once it
 * has been dismissed. Showing both at once would stack two dialogs on a
 * first-time visitor.
 */
export default function Onboarding() {
  const [supportDone, setSupportDone] = useState(false);

  return (
    <>
      <SupportPrompt onDismiss={() => setSupportDone(true)} />
      <ProductTour active={supportDone} />
    </>
  );
}
