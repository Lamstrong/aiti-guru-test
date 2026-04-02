import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      routesDirectory: "./app/routes",
      generatedRouteTree: "./types/routeTree.gen.ts",
    }),
    react(),
  ],
  server: {
    port: 3001,
  },
  build: {
    outDir: "build",
  },
});
