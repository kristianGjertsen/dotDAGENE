import { readFile, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const routesPath = resolve(__dirname, 'src', 'routes.json');
const outputPath = resolve(__dirname, 'public', 'sitemap.xml');
const baseUrl = process.env.SITEMAP_BASE_URL ?? 'https://dotdagene.no';

async function loadRoutes() {
  const rawRoutes = await readFile(routesPath, 'utf8');
  const parsedRoutes = JSON.parse(rawRoutes);

  if (!Array.isArray(parsedRoutes)) {
    throw new Error('Route manifest must be an array');
  }

  return parsedRoutes;
}

function buildUrlEntry(route, lastmod) {
  const { path, priority, changefreq, excludeFromSitemap } = route;

  if (excludeFromSitemap) {
    return null;
  }

  if (typeof path !== 'string') {
    return null;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const loc = new URL(normalizedPath, baseUrl).toString();
  const safePriority = Number.isFinite(priority) ? Math.min(Math.max(priority, 0), 1) : 0.7;

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq ?? 'weekly'}</changefreq>
    <priority>${safePriority.toFixed(1)}</priority>
  </url>`;
}

async function generateSitemap() {
  const routes = await loadRoutes();
  const today = new Date().toISOString().split('T')[0];

  const entries = routes
    .map((route) => buildUrlEntry(route, today))
    .filter(Boolean);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  await writeFile(outputPath, sitemap, 'utf8');
  console.log(`✅ Generated sitemap with ${entries.length} routes at ${outputPath}`);
}

generateSitemap().catch((error) => {
  console.error('❌ Failed to generate sitemap:', error);
  process.exit(1);
});
