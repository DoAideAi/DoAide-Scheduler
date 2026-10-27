import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_ARTICLES } from "../data/blogArticles";
import { jsonLdFor, metaForPath, routes } from "../routeMeta";

const appSrc = readFileSync(resolve(process.cwd(), "src/App.jsx"), "utf-8");

describe("routeMeta", () => {
  it("has unique paths, titles and descriptions", () => {
    for (const key of ["path", "title", "description"]) {
      const values = routes.map((r) => r[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("only lists public routes the router serves", () => {
    const publicPaths = new Set(
      [...appSrc.matchAll(/<Route\s+path="(\/[^"]*)"\s+element=\{(?!\s*<Protected)/g)].map((m) => m[1])
    );
    for (const r of routes) {
      for (const p of [r.path, ...(r.aliases ?? [])]) {
        if (!p.startsWith("/blog/")) expect(publicPaths.has(p), p).toBe(true);
      }
    }
    for (const p of ["/dashboard", "/bookings", "/book/acme/intro"]) expect(metaForPath(p)).toBeUndefined();
  });

  it("dates every blog post", () => {
    for (const a of BLOG_ARTICLES) {
      expect(jsonLdFor(metaForPath(`/blog/${a.slug}`)).datePublished).toBe(a.published);
    }
  });

  it("keeps titles within 70 chars", () => {
    for (const r of routes) expect(r.title.length, r.path).toBeLessThanOrEqual(70);
  });

  it("resolves short tool aliases to the canonical /tools page", () => {
    expect(metaForPath("/calculator").path).toBe("/tools/meeting-cost-calculator");
    expect(metaForPath("/timezone").path).toBe("/tools/timezone-converter");
  });

  it("only claims the calendar integration the backend has", () => {
    const home = JSON.stringify(jsonLdFor(metaForPath("/")));
    expect(home).not.toMatch(/Two-way sync with Google Calendar, Microsoft Outlook/);
    expect(home).not.toMatch(/aggregateRating/i);
  });
});
