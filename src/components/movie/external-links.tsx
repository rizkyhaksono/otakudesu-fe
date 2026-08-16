import type { MovieDetail } from "@/types/api";
import RateElsewhere, { type RateTarget } from "@/components/media/rate-elsewhere";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Outbound links for people who track what they watch.
 *
 * Letterboxd has no public API, but `letterboxd.com/tmdb/{id}/` resolves a TMDB
 * id straight to the film page — so the integration costs one URL and no
 * request. TMDB and IMDb round out the set.
 */
export default function ExternalLinks({
  detail,
  mediaType,
  t,
}: {
  detail: MovieDetail;
  mediaType: "movie" | "tv";
  t: Dictionary;
}) {
  const links = [
    // Letterboxd only catalogues films, not series.
    mediaType === "movie"
      ? { href: `https://letterboxd.com/tmdb/${detail.id}/`, label: "Letterboxd" }
      : null,
    {
      href: `https://www.themoviedb.org/${mediaType}/${detail.id}`,
      label: "TMDB",
    },
    detail.imdb_id ? { href: `https://www.imdb.com/title/${detail.imdb_id}/`, label: "IMDb" } : null,
    detail.homepage ? { href: detail.homepage, label: t.pages.movie.officialSite } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  /*
   * Rating is broken out from the link row on purpose: it is an action, not a
   * reference. Letterboxd is where film ratings belong; TMDB is the fallback
   * for series, which Letterboxd does not catalogue.
   */
  const rateTargets: RateTarget[] =
    mediaType === "movie"
      ? [
          {
            href: `https://letterboxd.com/tmdb/${detail.id}/`,
            label: "Letterboxd",
            note: t.pages.movie.rateLetterboxd,
          },
          { href: `https://www.themoviedb.org/movie/${detail.id}`, label: "TMDB" },
        ]
      : [
          {
            href: `https://www.themoviedb.org/tv/${detail.id}`,
            label: "TMDB",
            note: t.pages.movie.rateTmdbNote,
          },
        ];

  if (!links.length) return null;

  return (
    <section className="mt-6">
      <h2 className="eyebrow mb-2">{t.pages.movie.rating}</h2>
      <RateElsewhere targets={rateTargets} label={t.pages.animeDetail.rateOn} />

      <h2 className="eyebrow mt-6 mb-2">{t.pages.movie.more}</h2>
      <ul className="flex flex-wrap gap-px bg-border [&>*]:bg-background">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="press hover:bg-accent hover:text-primary flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase"
            >
              {link.label}
              <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
