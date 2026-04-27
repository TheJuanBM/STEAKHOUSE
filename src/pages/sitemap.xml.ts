import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.toString() || "https://lfsteakhouse.com").replace(/\/$/, "");

  const staticPages = [
    { url: "",         changefreq: "weekly",  priority: 1.0 },
    { url: "/menu",    changefreq: "weekly",  priority: 0.9 },
    { url: "/galeria", changefreq: "monthly", priority: 0.8 },
    { url: "/reservar",changefreq: "monthly", priority: 0.7 },
    { url: "/blog",                          changefreq: "weekly",  priority: 0.8 },
    { url: "/blog/que-hacer-en-caucasia",    changefreq: "monthly", priority: 0.8 },
  ];

  const posts = await getCollection("blog");
  const blogPages = posts.map((post) => ({
    url: `/blog/${post.id.replace(/\.md$/, "")}`,
    changefreq: "monthly",
    priority: 0.7,
    lastmod: post.data.date.toISOString(),
  }));

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${"lastmod" in p ? p.lastmod : new Date().toISOString()}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
