import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3031",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Test the production build: dev-mode CJS interop differs from the bundle
  // (#88 broke only the build). Own port and no reuse, so a running dev
  // server on 3030 can't stand in for it.
  webServer: {
    command: "yarn build && yarn preview --port 3031 --strictPort",
    url: "http://localhost:3031",
    reuseExistingServer: false,
  },
});
