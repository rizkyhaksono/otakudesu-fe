import { describe, expect, test } from "bun:test";
import { skipImageOptimizer } from "@/lib/image";

describe("skipImageOptimizer", () => {
  test("skips Cloudflare-fronted scraper CDNs", () => {
    expect(skipImageOptimizer("https://otakudesu.blog/wp-content/uploads/x.jpg")).toBe(true);
    expect(skipImageOptimizer("https://thumbnail.komiku.org/uploads/x.jpg")).toBe(true);
    expect(skipImageOptimizer("https://image2.komiku.to/upload5/x/1/1.webp")).toBe(true);
  });

  test("still optimizes stable CDNs", () => {
    expect(skipImageOptimizer("https://image.tmdb.org/t/p/w500/x.jpg")).toBe(false);
    expect(skipImageOptimizer("https://i.imgur.com/x.png")).toBe(false);
  });

  test("renders hosts outside the allowlist directly instead of throwing", () => {
    expect(skipImageOptimizer("https://comicvine.gamespot.com/a/uploads/x.jpg")).toBe(true);
    // A lookalike suffix is not a subdomain.
    expect(skipImageOptimizer("https://image.tmdb.org.evil.example/x.jpg")).toBe(true);
  });

  test("ignores empty or invalid src", () => {
    expect(skipImageOptimizer(null)).toBe(false);
    expect(skipImageOptimizer("not-a-url")).toBe(false);
  });
});
