const fs = require("fs");
const path = require("path");

const baseUrl = "https://dotdagene.no";

function generateSitemap() {
  const pagesDir = path.join(__dirname, "pages");
  const staticPages = getAllPages(pagesDir);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((page) => {
      const route = page
        .replace(pagesDir, "")
        .replace("/index.js", "")
        .replace(".js", "");
      const url = `${baseUrl}${route === "" ? "/" : route}`;
      return `<url><loc>${url}</loc></url>`;
    })
    .join("\n")}
  </urlset>`;

  fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), sitemap);
  console.log("✅ Sitemap generated at public/sitemap.xml");
}

function getAllPages(dir) {
  const files = fs.readdirSync(dir);
  return files.flatMap((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      return getAllPages(filePath);
    } else {
      return filePath.endsWith(".js") || filePath.endsWith(".tsx") ? [filePath] : [];
    }
  });
}

generateSitemap();
