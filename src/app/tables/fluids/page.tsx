import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { Droplet } from 'lucide-react';

export const metadata = {
  title: 'Fluid Properties Data Tables | MEPKit',
  description: 'Browse all available fluids for density, viscosity, and other property data tables.',
};

export default function FluidsIndexPage() {
  const directoryPath = path.join(process.cwd(), 'public', 'data', 'fluids');
  let files: string[] = [];

  try {
    files = fs.readdirSync(directoryPath);
  } catch (error) {
    console.error("Failed to read fluids directory", error);
  }

  // Filter JSON files and extract fluid names
  const fluids = files
    .filter(file => file.endsWith('.json') && file.includes('_Properties'))
    .map(file => file.replace('FluidTables_', '').replace('_Properties.json', ''));

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">Fluid Data Tables</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Select a fluid to view its properties (density, dynamic viscosity, etc.) across varying temperatures.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fluids.map(fluid => {
          const formatted = fluid.replace(/([A-Z])/g, ' $1').trim();
          return (
            <Link href={`/tables/fluids/${fluid}`} key={fluid} className="group">
              <div className="border rounded-lg p-4 bg-card hover:bg-muted/50 hover:border-primary transition-colors flex items-center space-x-3">
                <Droplet className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <span className="font-medium group-hover:text-primary transition-colors">{formatted}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
