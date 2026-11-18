import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `vite preview` sends netlify.toml's headers so e2e runs under the real CSP.
// Dev is left without them: HMR injects inline scripts the CSP would block.
function netlifyHeaders(): Record<string, string> {
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

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3030,
  },
  preview: {
    headers: netlifyHeaders(),
  },
});
