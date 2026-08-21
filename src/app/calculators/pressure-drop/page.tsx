import React from 'react';
import { PressureDropClient } from './PressureDropClient';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Pressure Drop Calculator | MEPKit',
  description: 'Calculate friction loss in a pipe run using Darcy-Weisbach equations.',
};

export default async function PressureDropPage() {
  const pipesDir = path.join(process.cwd(), 'public', 'data', 'pipes');
  const fluidsDir = path.join(process.cwd(), 'public', 'data', 'fluids');
  
  const pipeFiles = fs.existsSync(pipesDir) ? fs.readdirSync(pipesDir) : [];
  const fluidFiles = fs.existsSync(fluidsDir) ? fs.readdirSync(fluidsDir) : [];
  
  const pipeOptions = pipeFiles.filter(f => f.endsWith('.json')).map(f => ({
    label: f.replace('PipeTables_', '').replace('.json', '').replace(/_/g, ' '),
    filename: f
  }));

  const fluidOptions = fluidFiles.filter(f => f.endsWith('.json')).map(f => ({
    label: f.replace('FluidTables_', '').replace('_Properties.json', '').replace('.json', '').replace(/_/g, ' '),
    filename: f
  }));

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Pressure Drop Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Compute friction loss using the Darcy-Weisbach equation by combining pipe material properties and fluid characteristics.
      </p>
      
      <PressureDropClient pipeOptions={pipeOptions} fluidOptions={fluidOptions} />
    </div>
  );
}
