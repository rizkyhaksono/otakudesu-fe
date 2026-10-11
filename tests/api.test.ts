import { afterEach, describe, expect, test } from "bun:test";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const { api, apiOr } = await import("@/lib/api");

function mockFetch(status: number, body: unknown) {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
}

describe("api client", () => {
  test("unwraps the { data } envelope", async () => {
    mockFetch(200, { data: { title: "ok" } });
    expect(await api<{ title: string }>("/x")).toEqual({ title: "ok" });
  });

  test("returns null on 404 so pages can call notFound()", async () => {
    mockFetch(404, { error: "Not Found" });
    expect(await api("/x")).toBeNull();
  });

  test("returns null on 400 so bad URL input reads as not found", async () => {
    mockFetch(400, { error: "Invalid page" });
    expect(await api("/x")).toBeNull();
  });

  // A failure must throw: returning empty data let ISR cache a blank page.
  test("throws on rate limiting and server errors", async () => {
    mockFetch(429, { error: "Too Many Requests" });
    await expect(api("/x")).rejects.toThrow("429");
    mockFetch(502, { error: "Upstream request failed" });
    await expect(api("/x")).rejects.toThrow("502");
  });

  test("throws when the backend reports an error in a 200", async () => {
    mockFetch(200, { error: "Upstream request failed" });
    await expect(api("/x")).rejects.toThrow("Upstream request failed");
  });

  test("throws when the backend is unreachable", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    await expect(api("/x")).rejects.toThrow("fetch failed");
  });

  test("apiOr substitutes the fallback only for missing data", async () => {
    mockFetch(404, { error: "Not Found" });
    expect(await apiOr("/x", { results: [] })).toEqual({ results: [] });
    mockFetch(500, { error: "boom" });
    await expect(apiOr("/x", { results: [] })).rejects.toThrow("500");
  });
});
