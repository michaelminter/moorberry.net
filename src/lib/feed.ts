import { getCollection } from "astro:content";

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
})[character] || character);

export async function createFeed() {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const items = posts.map((post) => {
    const url = `https://moorberry.net/articles/${post.id}/`;
    return `<item><title>${escapeXml(post.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.description || post.data.title)}</description></item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Moorberry articles</title><link>https://moorberry.net/articles/</link><description>Articles by Michael Minter on software and the web.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
