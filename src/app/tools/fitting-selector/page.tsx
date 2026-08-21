import React from 'react';
import { FittingSelectorClient } from './FittingSelectorClient';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Fitting & Valve Selector | MEPKit',
  description: 'Search and filter fittings and valves by nominal size and type to find K-factors.',
};

export default async function FittingSelectorPage() {
  const fittingsPath = path.join(process.cwd(), 'public', 'data', 'fittings', 'FittingTables_Pfn_Fittings.json');
  let fittings = [];
  
  if (fs.existsSync(fittingsPath)) {
    fittings = JSON.parse(fs.readFileSync(fittingsPath, 'utf8'));
  }

  // Pre-calculate unique types and sizes for filters
  const types = Array.from(new Set(fittings.map((f: any) => f.description.split(' - ')[0] || f.description))) as string[]; types.sort();
  const sizes = Array.from(new Set(fittings.map((f: any) => f.size_imperial))) as string[]; sizes.sort();

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Fitting & Valve Selector</h1>
      <p className="text-muted-foreground mb-8">
        Search for fittings by nominal size and type to retrieve standard friction loss coefficients (K-factors).
      </p>
      
      <FittingSelectorClient fittings={fittings} types={types} sizes={sizes} />
    </div>
  );
}
