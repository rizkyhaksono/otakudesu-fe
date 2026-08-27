import { ExternalLink, Globe } from "lucide-react";
import { getShinigamiStatus } from "@/services/shinigami";
import { getDictionary } from "@/lib/i18n/server";

/**
 * Shinigami's live domain.
 *
 * Rendered from their own link portal rather than a hardcoded URL, because the
 * domain rotates constantly — that rotation is the entire reason this card
 * exists. The backend resolves it; if the portal is unreachable the card
 * renders nothing at all rather than showing a link that is probably dead.
 */
export default async function ShinigamiCard({ params }: { params: Promise<{ locale: string }> }) {
  const [status, { t }] = await Promise.all([getShinigamiStatus(), getDictionary(params)]);
  if (!status?.current) return null;

  const host = safeHost(status.current);

  return (
    <section className="border">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <p className="eyebrow flex items-center gap-1.5">
          <Globe className="text-primary size-3.5" aria-hidden />
          {t.pages.shinigami.title}
        </p>
        <span className="text-muted-foreground font-mono text-[0.6rem] uppercase">
          {t.pages.shinigami.live}
        </span>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t.pages.shinigami.body}
        </p>

        <a
          href={status.current}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="press bg-primary text-primary-foreground hover:bg-primary/90 mt-3 inline-flex max-w-full items-center gap-2 px-3 py-2 text-sm font-semibold"
        >
          <span className="truncate font-mono">{host}</span>
          <ExternalLink className="size-3.5 shrink-0" aria-hidden />
        </a>

        {status.links.length > 1 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {status.links.slice(1).map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="chip hover:bg-accent"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

/** Display the bare host; the full URL is noise in a button label. */
function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
