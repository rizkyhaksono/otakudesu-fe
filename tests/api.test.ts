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

  test("returns null when the backend reports an error", async () => {
    mockFetch(200, { error: "Upstream request failed" });
    expect(await api("/x")).toBeNull();
  });

  test("returns null instead of throwing when the backend is unreachable", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    // A dead backend must degrade the page, not crash the whole render tree.
    expect(await api("/x")).toBeNull();
  });

  test("apiOr substitutes the fallback", async () => {
    mockFetch(500, { error: "boom" });
    expect(await apiOr("/x", { results: [] })).toEqual({ results: [] });
  });
});
