// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

const baseHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://lh3.googleusercontent.com",
  "frame-src https://www.google.com https://maps.google.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// https://astro.build/config
export default defineConfig({
  site: "https://lfsteakhouse.com",
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
    server: { headers: baseHeaders },
    preview: { headers: { ...baseHeaders, "Content-Security-Policy": csp } },
  },
});
