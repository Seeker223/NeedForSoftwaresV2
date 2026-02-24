import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { render } from "../dist/server/entry-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistDir = path.resolve(__dirname, "../dist/client");
const indexHtmlPath = path.join(clientDistDir, "index.html");

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
  ".woff2": "font/woff2"
};

const isSafePath = (root, target) => {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
};

const sendStaticIfExists = async (pathname, res) => {
  if (pathname === "/" || pathname.endsWith("/")) return false;

  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const filePath = path.join(clientDistDir, cleanPath);

  if (!isSafePath(clientDistDir, filePath)) {
    return false;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return false;

    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader(
      "Content-Type",
      MIME_TYPES[ext] || "application/octet-stream"
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    const file = await fs.readFile(filePath);
    res.end(file);
    return true;
  } catch {
    return false;
  }
};

export default async function handler(req, res) {
  try {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `https://${host}`);
    const pathname = url.pathname;

    const served = await sendStaticIfExists(pathname, res);
    if (served) return;

    const template = await fs.readFile(indexHtmlPath, "utf-8");
    const { html, head = "" } = render(`${pathname}${url.search}`);

    const page = template
      .replace("<!--ssr-outlet-->", html)
      .replace("<!--app-head-->", head);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.end(page);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(error?.stack || "Server render failed");
  }
}
