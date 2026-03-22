import type { APIRoute } from "astro";

type Page = {
  url: string;
  priority: number;
  changefreq: string;
};

const pages: Page[] = [
  { url: "", changefreq: "weekly", priority: 1.0 },
  { url: "menu", changefreq: "weekly", priority: 0.9 },
  { url: "galeria", changefreq: "monthly", priority: 0.8 },
  { url: "reserva", changefreq: "monthly", priority: 0.7 },
];

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() || "https://lfsteakhouse.com";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (page) => `  <url>
        <loc>${baseUrl}${page.url}</loc>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
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
