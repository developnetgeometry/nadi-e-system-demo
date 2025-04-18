import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// This is needed to properly type the test configuration
import type { UserConfig } from "vitest/config";

export default defineConfig(
  ({ mode }) =>
    ({
      plugins: [react(), mode === "development" && componentTagger()].filter(
        Boolean
      ),
      server: {
        host: "::",
        port: 8080,
        allowedHosts: [
          "74195fe7-3453-45bd-ab45-e10505e630c5.lovableproject.com",
          "localhost",
          "nadi-dev.devnetgeometry.run.place",
        ],
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts",
        css: true,
        coverage: {
          reporter: ["text", "json", "html"],
          exclude: ["node_modules/", "src/test/setup.ts"],
        },
      },
    }) as UserConfig
);
