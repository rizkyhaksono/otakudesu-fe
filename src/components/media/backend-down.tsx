"use client";

import { useI18n } from "@/lib/i18n/client";

/**
 * Shown when the API itself cannot be reached, as opposed to a domain simply
 * having no data. The distinction matters: one is fixed by starting a service,
 * the other by setting a token.
 */
export default function BackendDown() {
  const { t } = useI18n();

  return (
    <div className="border p-8 text-center sm:p-12">
      <p className="eyebrow text-destructive">{t.pages.backendDown.eyebrow}</p>
      <h2 className="font-display mt-2 text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
        {t.pages.backendDown.title}
      </h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm">
        {t.pages.backendDown.body}
      </p>
      <pre className="bg-muted mx-auto mt-4 max-w-md overflow-x-auto border p-3 text-left font-mono text-xs">
        cd otakudesu-be{"\n"}bun run start
      </pre>
      <p className="text-muted-foreground mt-3 font-mono text-xs">
        {t.pages.backendDown.hint}
      </p>
    </div>
  );
}
