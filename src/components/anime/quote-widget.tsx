import { Quote } from "lucide-react";
import { getRandomQuote } from "@/services/quotes";
import { getDictionary } from "@/lib/i18n/server";

/**
 * A random line from AnimeChan's open quote dataset.
 *
 * Cached for five minutes on purpose: `revalidate: 0` opted the entire
 * homepage out of ISR and forced a full SSR of six backends on every visit,
 * which is what turned origin timeouts into Cloudflare 500s. A quote that
 * rotates every few minutes is close enough; an empty slot is fine if the
 * upstream is unreachable.
 */
export default async function QuoteWidget({ params }: { params: Promise<{ locale: string }> }) {
  const [quote, { t }] = await Promise.all([getRandomQuote(), getDictionary(params)]);
  if (!quote) return null;

  return (
    <figure className="border-primary bg-card border-l-4 p-5">
      <Quote className="text-primary/40 size-6" aria-hidden />
      <blockquote className="mt-2 text-balance">
        <p className="text-lg leading-relaxed font-medium">“{quote.content}”</p>
      </blockquote>
      <figcaption className="text-muted-foreground mt-3 font-mono text-xs uppercase">
        {quote.character} — {quote.anime}
      </figcaption>
      <p className="text-muted-foreground/70 mt-2 font-mono text-[0.6rem] uppercase">
        {t.pages.identify.quoteSource}
      </p>
    </figure>
  );
}
