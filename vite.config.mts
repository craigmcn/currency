import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function readNetlifyHeaders(): Record<string, string> {
  const toml = readFileSync(new URL("./netlify.toml", import.meta.url), "utf8");
  const section = toml.split("[headers.values]")[1]?.split(/^\[/m)[0] ?? "";
  const headers = Object.fromEntries(
    [...section.matchAll(/^\s+([\w-]+) = "(.*)"$/gm)].map(([, k, v]) => [k, v]),
  );
  if (!headers["Content-Security-Policy"]) {
    throw new Error("No Content-Security-Policy found in netlify.toml");
  }
  return headers;
}

// `vite preview` sends netlify.toml's headers so e2e runs under the real CSP.
// A preview-only hook, so dev (HMR needs inline scripts), build and Vitest
// never read netlify.toml.
function netlifyPreviewHeaders(): Plugin {
  return {
    name: "netlify-preview-headers",
    configurePreviewServer(server) {
      const headers = readNetlifyHeaders();
      server.middlewares.use((_req, res, next) => {
        for (const [name, value] of Object.entries(headers)) {
          res.setHeader(name, value);
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyPreviewHeaders()],
  base: "./",
  server: {
    port: 3030,
  },
});
