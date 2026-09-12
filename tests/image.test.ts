import { describe, expect, test } from "bun:test";
import { skipImageOptimizer } from "@/lib/image";

describe("skipImageOptimizer", () => {
  test("skips Cloudflare-fronted scraper CDNs", () => {
    expect(skipImageOptimizer("https://otakudesu.blog/wp-content/uploads/x.jpg")).toBe(true);
    expect(skipImageOptimizer("https://thumbnail.komiku.org/uploads/x.jpg")).toBe(true);
    expect(skipImageOptimizer("https://img.kiryuuid.net/cover.jpg")).toBe(true);
  });

  test("still optimizes stable CDNs", () => {
    expect(skipImageOptimizer("https://image.tmdb.org/t/p/w500/x.jpg")).toBe(false);
    expect(skipImageOptimizer("https://i.imgur.com/x.png")).toBe(false);
  });

  test("ignores empty or invalid src", () => {
    expect(skipImageOptimizer(null)).toBe(false);
    expect(skipImageOptimizer("not-a-url")).toBe(false);
  });
});
