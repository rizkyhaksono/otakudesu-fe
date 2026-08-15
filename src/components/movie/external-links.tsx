import type { MovieDetail } from "@/types/api";

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
}: {
  detail: MovieDetail;
  mediaType: "movie" | "tv";
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
    detail.homepage ? { href: detail.homepage, label: "Situs resmi" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  if (!links.length) return null;

  return (
    <section className="mt-6">
      <h2 className="eyebrow mb-2">Selengkapnya</h2>
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
