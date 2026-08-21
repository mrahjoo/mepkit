import React from 'react';
import fs from 'fs';
import path from 'path';
import { FluidPropertiesClient } from './FluidPropertiesClient';

export const metadata = {
  title: 'Fluid Properties Explorer | MEPKit',
  description: 'Interpolate density, viscosity, and vapor pressure for various fluids.',
};

export default async function FluidPropertiesPage() {
  const fluidsDir = path.join(process.cwd(), 'public', 'data', 'fluids');
  const files = fs.existsSync(fluidsDir) ? fs.readdirSync(fluidsDir) : [];
  
  const fluidOptions = files
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const name = f.replace('FluidTables_', '').replace('_Properties.json', '').replace('.json', '').replace(/_/g, ' ');
      return { label: name, filename: f };
    });

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Fluid Properties Explorer</h1>
      <p className="text-muted-foreground mb-8">
        Select a fluid and input a temperature to interpolate physical properties.
      </p>
      
      <FluidPropertiesClient options={fluidOptions} />
    </div>
  );
}
