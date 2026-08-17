import { apiBaseUrl } from "@/lib/api";

/**
 * Same-origin proxy for the backend's calendar feed.
 *
 * This one matters more than the other proxies: a `webcal://` or `https://`
 * subscription URL is something a user pastes into Calendar and keeps forever,
 * so it should point at the site's own domain, not an internal API host that
 * might change.
 *
 * `force-dynamic`, not `export const revalidate`: this handler takes no
 * `request` parameter, so it has no signal Next recognizes as "dynamic" on
 * its own — a bare `revalidate` export on a route shaped like that makes
 * Next try to run it once at *build* time to produce a static response. The
 * backend is not reachable during a CI build, so that attempt fails the whole
 * build outright. Caching still happens, just at the `fetch()` layer below.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  let upstream: Response;
  try {
    upstream = await fetch(`${apiBaseUrl()}/api/v1/anime/schedule.ics`, {
      next: { revalidate: 21_600 },
    });
  } catch {
    return new Response("", { status: 502 });
  }

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
