import "server-only";

/**
 * Typed access to the backend.
 *
 * Every call runs inside a Server Component or route handler — never in the
 * browser — which is why the base URL has no `NEXT_PUBLIC_` prefix and why the
 * rendered HTML actually contains content for crawlers.
 */

const BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

// Every render reaches the backend from this server's one IP; the token keeps
// those renders out of the backend's per-IP rate limit.
const INTERNAL_TOKEN = process.env.INTERNAL_API_TOKEN;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = {
  /** Seconds to cache. Mirrors the backend's own revalidate windows. */
  revalidate?: number;
  tags?: string[];
};

// The build prerenders pages against the live API; a flaky upstream then must
// not fail the whole deploy. ISR replaces that page on its first revalidation.
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Returns `null` for 404 so pages can call `notFound()` themselves and emit a
 * real HTTP 404 rather than a soft 404 with status 200.
 *
 * Any other failure (unreachable, timeout, 429, 5xx, error payload) throws.
 * Returning empty data there let ISR cache an empty page — or a fake 404 — as
 * a success, so visitors saw blank pages until a refresh. A throw during
 * revalidation keeps serving the last good page instead.
 */
export async function api<T>(path: string, options: Options = {}): Promise<T | null> {
  const { revalidate = 300, tags } = options;
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate, ...(tags?.length ? { tags } : {}) },
      headers: {
        Accept: "application/json",
        ...(INTERNAL_TOKEN ? { "x-internal-token": INTERNAL_TOKEN } : {}),
      },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    return failed(0, path, error instanceof Error ? error.message : "fetch failed");
  }

  // 400 is bad input from the URL (e.g. `?page=abc`): treat it as not found, not as an outage.
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) return failed(response.status, path, response.statusText);

  const payload = (await response.json()) as { data?: T; error?: string };
  if (payload.error !== undefined) return failed(response.status, path, payload.error);

  return (payload.data ?? null) as T | null;
}

function failed(status: number, path: string, reason: string): null {
  if (IS_BUILD) {
    console.warn(`[api] build fallback ${status} ${path}: ${reason}`);
    return null;
  }
  throw new ApiError(status, `[api] ${status} ${path}: ${reason}`);
}

/** Same as `api` but falls back to a value instead of `null` (404 or no data). Failures still throw. */
export async function apiOr<T>(path: string, fallback: T, options: Options = {}): Promise<T> {
  return (await api<T>(path, options)) ?? fallback;
}

export function apiBaseUrl(): string {
  return BASE_URL;
}

/**
 * Cheap liveness check against the backend.
 *
 * Used only to tell two very different failures apart in the UI: "the backend
 * is down" and "the backend is up but this domain has no data". Rendering the
 * same empty state for both sent a real user hunting through their `.env` when
 * the actual problem was a service that had not been started.
 */
export async function isBackendReachable(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
