import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      exclude: ["e2e/**", "node_modules/**"],
      setupFiles: "./tests/setup.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/index.tsx", "src/types/**", "**/*.test.{ts,tsx}"],
      },
    },
  }),
);
