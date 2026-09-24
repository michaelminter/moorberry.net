import type { CollectionEntry } from "astro:content";

export const tagSlug = (tag: string) => tag.toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9_\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-");

export function groupByTag(posts: CollectionEntry<"blog">[]) {
  const tags = new Map<string, { name: string; posts: CollectionEntry<"blog">[] }>();
  for (const post of posts) {
    for (const name of post.data.tags || []) {
      const slug = tagSlug(name);
      if (!slug) continue;
      const group = tags.get(slug) || { name, posts: [] };
      group.posts.push(post);
      tags.set(slug, group);
    }
  }
  return tags;
}
