/**
 * Dates rendered on the server must not inherit the container's timezone —
 * otherwise the same article shows a different day depending on where the
 * process happens to run. Jakarta is pinned because the audience is Indonesian.
 */
const newsDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatNewsDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : newsDate.format(date);
}
