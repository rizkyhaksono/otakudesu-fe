import { Coffee, Heart, Star } from "lucide-react";
import { REPOS, SAWERIA } from "@/lib/onboarding";
import { getDictionary } from "@/lib/i18n/server";

/**
 * "Support this project" sidebar card.
 *
 * Distinct from the one-time `SupportPrompt` modal and its docked tab: this is
 * a quiet, permanent card that sits in a page's aside column, for someone who
 * is already reading and might choose to give back. Donation first, star
 * second — a Saweria link is the ask this card exists for; the repo link is
 * the free alternative for people who would rather contribute that way.
 *
 * A Server Component: two outbound links and no state, so there is nothing
 * here worth shipping to the browser.
 */
export default async function SupportCard({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await getDictionary(params);

  return (
    <section className="border">
      <p className="eyebrow flex items-center gap-1.5 border-b p-3">
        <Heart className="text-primary size-3.5" aria-hidden />
        {t.support.cardTitle}
      </p>

      <div className="p-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{t.support.cardBody}</p>

        <div className="mt-4 grid gap-px bg-border [&>*]:bg-background">
          <a
            href={SAWERIA}
            target="_blank"
            rel="noopener noreferrer"
            className="press bg-primary! text-primary-foreground hover:opacity-90 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold"
          >
            <Coffee className="size-4 shrink-0" aria-hidden />
            {t.support.donate}
          </a>

          <a
            href={REPOS.frontend}
            target="_blank"
            rel="noopener noreferrer"
            className="press hover:bg-accent flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
          >
            <Star className="text-primary size-4 shrink-0" aria-hidden />
            {t.support.star}
          </a>
        </div>
      </div>
    </section>
  );
}
