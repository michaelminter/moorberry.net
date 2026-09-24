import { getCollection } from "astro:content";
import { groupByTag } from "../lib/tags";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const paths = ["/", "/articles/", "/tags/", ...posts.map((post) => `/articles/${post.id}/`), ...[...groupByTag(posts).keys()].map((tag) => `/tags/${tag}/`)];
  const urls = paths.map((path) => `<url><loc>https://moorberry.net${path}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
