import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolve = (p) => path.resolve(__dirname, p);
const isProd = process.argv.includes("--prod");
const port = Number(process.env.PORT || 5173);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  createReadStream(filePath).pipe(res);
};

let vite;
let prodTemplate;
let prodRender;

if (!isProd) {
  const { createServer } = await import("vite");
  vite = await createServer({
    root: __dirname,
    appType: "custom",
    server: { middlewareMode: true },
  });
} else {
  prodTemplate = await readFile(resolve("dist/client/index.html"), "utf-8");
  ({ render: prodRender } = await import("./dist/server/entry-server.js"));
}

const server = createHttpServer(async (req, res) => {
  const url = req.url || "/";

  try {
    if (!isProd) {
      vite.middlewares(req, res, async () => {
        const template = await readFile(resolve("index.html"), "utf-8");
        const transformed = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
        const { html, head = "" } = render(url);
        const page = transformed
          .replace("<!--ssr-outlet-->", html)
          .replace("<!--app-head-->", head);

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(page);
      });
      return;
    }

    // Serve built static assets first.
    const cleanPath = url.split("?")[0];
    if (cleanPath !== "/" && cleanPath !== "/index.html") {
      const staticPath = resolve(`dist/client${cleanPath}`);
      if (existsSync(staticPath)) {
        sendFile(res, staticPath);
        return;
      }
    }

    const { html, head = "" } = prodRender(url);
    const page = prodTemplate
      .replace("<!--ssr-outlet-->", html)
      .replace("<!--app-head-->", head);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page);
  } catch (error) {
    if (!isProd && vite) {
      vite.ssrFixStacktrace(error);
    }
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(error?.stack || "SSR server error");
  }
});

server.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
});
