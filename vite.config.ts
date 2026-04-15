import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
