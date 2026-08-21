import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Component Library | MEPKit',
  description: 'Browse our extensive catalog of piping components including flanges, valves, pipes, fittings, and more.',
};

export default async function ComponentsCatalogPage() {
  const catalogPath = path.join(process.cwd(), 'public', 'data', 'pipedata_catalog.json');
  let catalog: { id: string, category: string, filename: string }[] = [];
  
  if (fs.existsSync(catalogPath)) {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  }

  // Group by category
  const categories = catalog.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof catalog>);

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Component Library</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Select a component category below to explore its dimension tables and CAD files.
      </p>

      {Object.entries(categories).sort().map(([category, items]) => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-semibold capitalize border-b pb-2 mb-4">
            {category}s ({items.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map(item => (
              <Link href={`/components/${category}/${encodeURIComponent(item.id)}`} key={item.id} className="block group">
                <div className="border rounded-md p-3 h-full bg-card hover:border-primary transition-colors shadow-sm hover:shadow-md text-sm truncate" title={item.id}>
                  {item.id}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      
      {catalog.length === 0 && (
        <p className="text-muted-foreground">No components found. Run prebuild script.</p>
      )}
    </div>
  );
}
