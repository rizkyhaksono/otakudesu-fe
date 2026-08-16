import { apiBaseUrl } from "@/lib/api";

export const revalidate = 21_600;

/**
 * Same-origin proxy for the backend's calendar feed.
 *
 * This one matters more than the other proxies: a `webcal://` or `https://`
 * subscription URL is something a user pastes into Calendar and keeps forever,
 * so it should point at the site's own domain, not an internal API host that
 * might change.
 */
export async function GET() {
  const upstream = await fetch(`${apiBaseUrl()}/api/v1/anime/schedule.ics`, {
    next: { revalidate: 21_600 },
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="jadwal-anime.ics"',
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200",
    },
  });
}
