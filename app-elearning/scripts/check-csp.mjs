// Sirve out/ con las cabeceras de vercel.json (ni `next dev` ni el CI las aplican) y falla si
// alguna página del sitemap viola la CSP. Requiere `npm run build` antes (sin basePath).
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "@playwright/test";

const headers = Object.fromEntries(
  JSON.parse(readFileSync("vercel.json", "utf8")).headers[0].headers.map((h) => [h.key, h.value])
);
if (!headers["Content-Security-Policy"]) throw new Error("vercel.json no define Content-Security-Policy.");

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };

const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([\/]|\.\.)+/, "");
  const file = [path, `${path}.html`, join(path, "index.html")]
    .map((p) => join("out", p))
    .find((p) => existsSync(p) && statSync(p).isFile());
  if (!file) return res.writeHead(404, headers).end();
  res.writeHead(200, { ...headers, "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const paths = [...readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (paths.length === 0) throw new Error("out/sitemap.xml no tiene URLs.");

const browser = await chromium.launch();
const context = await browser.newContext({ serviceWorkers: "block" });
const violations = new Map();
const failures = [];
await context.exposeBinding("__csp", ({ page }, key) => {
  if (!violations.has(key)) violations.set(key, new URL(page.url()).pathname);
});
await context.addInitScript(() =>
  document.addEventListener("securitypolicyviolation", (e) => window.__csp(`${e.violatedDirective} ${e.blockedURI}`))
);

let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    const page = await context.newPage();
    while (next < paths.length) {
      const path = paths[next++];
      try {
        const response = await page.goto(base + path, { waitUntil: "networkidle" });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
        // Desplaza la página para que se monte el contenido diferido (p. ej. Mermaid).
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 800) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
        });
        await page.waitForTimeout(200);
      } catch (error) {
        failures.push(`${path}: ${error.message.split("\n")[0]}`);
      }
    }
  })
);
await browser.close();
server.close();

for (const [key, path] of violations) console.error(`Violación CSP: ${key} (primera vez en ${path})`);
for (const failure of failures) console.error(`Página sin revisar: ${failure}`);
console.log(`CSP: ${paths.length} páginas, ${violations.size} violaciones, ${failures.length} sin revisar.`);
process.exit(violations.size || failures.length ? 1 : 0);
