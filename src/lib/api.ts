import "server-only";

/**
 * Typed access to the backend.
 *
 * Every call runs inside a Server Component or route handler — never in the
 * browser — which is why the base URL has no `NEXT_PUBLIC_` prefix and why the
 * rendered HTML actually contains content for crawlers.
 */

const BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

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

/**
 * Returns `null` for 404 so pages can call `notFound()` themselves and emit a
 * real HTTP 404 rather than a soft 404 with status 200.
 */
export async function api<T>(path: string, options: Options = {}): Promise<T | null> {
  const { revalidate = 300, tags } = options;
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate, ...(tags?.length ? { tags } : {}) },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    // The backend being unreachable must not crash the whole page tree.
    return null;
  }

  if (response.status === 404) return null;

  if (!response.ok) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[api] ${response.status} ${path}`);
    }
    return null;
  }

  const payload = (await response.json()) as { data?: T; error?: string };
  if (payload.error !== undefined) return null;

  return (payload.data ?? null) as T | null;
}

/** Same as `api` but falls back to a value instead of `null`. */
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
