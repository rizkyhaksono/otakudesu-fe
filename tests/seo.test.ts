import { describe, expect, test } from "bun:test";
import { metaDescription } from "@/lib/seo";
import { absoluteUrl, isNavGroup, NAV, NAV_FLAT, SITE } from "@/lib/site";

describe("metaDescription", () => {
  test("falls back when the source is blank", () => {
    // Upstream synopses are frequently present but empty, and `??` does not
    // catch that — which previously shipped pages with no description at all.
    expect(metaDescription("", "fallback")).toBe("fallback");
    expect(metaDescription("   ", "fallback")).toBe("fallback");
    expect(metaDescription(null, "fallback")).toBe("fallback");
    expect(metaDescription(undefined, "fallback")).toBe("fallback");
  });

  test("keeps real text", () => {
    expect(metaDescription("Sinopsis asli", "fallback")).toBe("Sinopsis asli");
  });

  test("truncates long text on a clean boundary", () => {
    const result = metaDescription("a".repeat(500), "fallback");
    expect(result.length).toBeLessThanOrEqual(300);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("site config", () => {
  test("absoluteUrl always produces one slash", () => {
    expect(absoluteUrl("/anime/x")).toBe(`${SITE.url}/anime/x`);
    expect(absoluteUrl("anime/x")).toBe(`${SITE.url}/anime/x`);
  });

  test("navigation targets are all absolute paths", () => {
    for (const item of NAV_FLAT) expect(item.href.startsWith("/")).toBe(true);
  });

  test("every grouped link also appears in the flat list", () => {
    // The footer, mobile menu and sitemap read NAV_FLAT; a link added only to a
    // dropdown would silently disappear from all three.
    const flat = new Set(NAV_FLAT.map((item) => item.href));
    for (const entry of NAV) {
      if (isNavGroup(entry)) {
        for (const item of entry.items) expect(flat.has(item.href)).toBe(true);
      } else {
        expect(flat.has(entry.href)).toBe(true);
      }
    }
  });
});
