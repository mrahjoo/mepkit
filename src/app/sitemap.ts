import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mepkit.com';

  // Static routes
  const staticRoutes = [
    '',
    '/calculators',
    '/calculators/fluid-properties',
    '/calculators/pressure-drop',
    '/calculators/acoustic-impedance',
    '/calculators/decibel',
    '/calculators/decibel-weighting',
    '/calculators/environmental-noise',
    '/calculators/fan-noise',
    '/calculators/speed-of-sound',
    '/components',
    '/tools',
    '/tools/bom-builder',
    '/tools/fitting-selector',
    '/tools/size-lookup',
    '/tools/system-simulator',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let componentRoutes: MetadataRoute.Sitemap = [];
  try {
    const catalogPath = path.join(process.cwd(), 'public', 'data', 'pipedata_catalog.json');
    if (fs.existsSync(catalogPath)) {
      const catalogContent = fs.readFileSync(catalogPath, 'utf8');
      const catalog = JSON.parse(catalogContent);

      if (Array.isArray(catalog)) {
        componentRoutes = catalog.map((item: any) => ({
          url: `${baseUrl}/components/${item.category}/${item.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch (error) {
    console.error('Error generating sitemap for components:', error);
  }

  let toolRoutes: MetadataRoute.Sitemap = [];
  try {
    const toolsDir = path.join(process.cwd(), 'data', 'tools');
    if (fs.existsSync(toolsDir)) {
      const files = fs.readdirSync(toolsDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const slug = file.replace('.json', '');
          toolRoutes.push({
            url: `${baseUrl}/tools/${slug}`,
            lastModified: new Date(), // Could read mtime, but this works
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error generating sitemap for dynamic tools:', error);
  }

  return [...staticRoutes, ...componentRoutes, ...toolRoutes];
}
