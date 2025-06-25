import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  const plugins: PluginOption[] = [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "tesnim",
        short_name: "ViteApp",
        description: "Best lightweight Vite app",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ];

  // Add compression plugin only in production
  if (isProduction) {
    plugins.push(
      compression({
        algorithm: "gzip",
        ext: ".gz",
      })
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      open: true,
      strictPort: false,
      middlewareMode: false,
    },
    build: {
      outDir: "dist",
      sourcemap: !isProduction,
      minify: isProduction ? "terser" : false,
      assetsInlineLimit: 4096,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : undefined,
      rollupOptions: {
        output: {
          manualChunks: isProduction
            ? {
                react: ["react", "react-dom"],
              }
            : undefined,
        },
      },
      chunkSizeWarningLimit: 500,
    },
  };
});
