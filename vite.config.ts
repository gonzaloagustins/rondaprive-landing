import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      // SW is disabled in dev to avoid fighting with Vite's HMR; it's fully
      // active on `npm run preview` and in production.
      devOptions: { enabled: false },
      includeAssets: [
        "favicon.ico",
        "og-image.jpg",
        "hero-poster.jpg",
        "hero-poster-sm.jpg",
      ],
      manifest: {
        name: "Ronda Privé",
        short_name: "Ronda Privé",
        description:
          "Plataforma tecnológica premium para eventos, festivales y venues.",
        theme_color: "#1A1814",
        background_color: "#F5F0EB",
        display: "standalone",
        start_url: "/",
        lang: "es",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precache is intentionally narrow — only the code needed to boot the
        // app. Every image beyond the tiny bootstrap set (icons, poster, OG)
        // is handled by runtime caching below so we don't burn 3 MB of the
        // user's quota on a first visit that might never scroll past the hero.
        globPatterns: ["**/*.{js,css,html,woff2}", "manifest.webmanifest"],
        globIgnores: [
          "**/hero-video*.{mp4,webm}",
          "**/*.{jpg,jpeg,webp,png,svg}",
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // SPA routing: a deep-link reload on /contacto must serve index.html.
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Google Fonts stylesheet — stale-while-revalidate so the page
            // paints with cached fonts and picks up foundry updates later.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            // Google Fonts woff2 files — long-lived, cache-first.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Same-origin images — first visit pays network, repeat visits
            // are instant. We include all image types (WebP + JPG fallback +
            // PNG icons) and expire after a month.
            urlPattern: ({ request, url }) =>
              request.destination === "image" && url.origin === self.location.origin,
            handler: "CacheFirst",
            options: {
              cacheName: "local-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Hero video — cache-first with range-request support so Safari
            // seeks work. Only a handful of entries since we have 4 files.
            urlPattern: /\/hero-video.*\.(mp4|webm)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "hero-video",
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 30 },
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Unsplash images used on /eventos and blog-style pages.
            urlPattern: /^https:\/\/images\.unsplash\.com\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "unsplash-images",
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: "es2020",
    cssTarget: "chrome80",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split the big main bundle into cacheable vendor chunks so browsers
        // can parallelize downloads and keep unchanged code cached on updates.
        manualChunks: (id: string) => {
          if (!id.includes("node_modules")) return undefined;
          // Keep React + anything that calls React.createContext at module init
          // together, so they share the same initialization order. Splitting
          // react-i18next or react-router into their own chunks causes
          // "Cannot read properties of undefined (reading 'createContext')"
          // when the downstream chunk evaluates before the React chunk.
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/scheduler/") ||
            id.includes("react-router") ||
            id.includes("react-i18next") ||
            id.includes("@tanstack")
          ) {
            return "vendor-react";
          }
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("lucide-react")) return "vendor-icons";
          return undefined;
        },
      },
    },
  },
}));
