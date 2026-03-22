import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.toString() || 'https://lfsteakhouse.com/';
  const sitemapUrl = `${baseUrl}sitemap.xml`;

  const robotsTxt = `
    # LF Steakhouse - robots.txt
    # https://lfsteakhouse.com

    User-agent: *
    Allow: /

    # Bloquear assets internos
    Disallow: /_assets/

    # Sitemap
    Sitemap: ${sitemapUrl}
  `;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
