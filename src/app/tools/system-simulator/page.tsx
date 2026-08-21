import React from 'react';
import fs from 'fs';
import path from 'path';
import { SystemSimulatorClient } from './SystemSimulatorClient';

export const metadata = {
  title: 'System Pressure Drop Simulator | MEPKit',
  description: 'Assemble a pipe network with segments and fittings to compute total end-to-end friction loss.',
};

export default async function SystemSimulatorPage() {
  const pipesDir = path.join(process.cwd(), 'public', 'data', 'pipes');
  const fluidsDir = path.join(process.cwd(), 'public', 'data', 'fluids');
  const fittingsPath = path.join(process.cwd(), 'public', 'data', 'fittings', 'FittingTables_Pfn_Fittings.json');
  
  const pipeFiles = fs.existsSync(pipesDir) ? fs.readdirSync(pipesDir) : [];
  const fluidFiles = fs.existsSync(fluidsDir) ? fs.readdirSync(fluidsDir) : [];
  
  let fittings = [];
  if (fs.existsSync(fittingsPath)) {
    fittings = JSON.parse(fs.readFileSync(fittingsPath, 'utf8'));
  }
  
  const pipeOptions = pipeFiles.filter(f => f.endsWith('.json')).map(f => ({
    label: f.replace('PipeTables_', '').replace('.json', '').replace(/_/g, ' '),
    filename: f
  }));

  const fluidOptions = fluidFiles.filter(f => f.endsWith('.json')).map(f => ({
    label: f.replace('FluidTables_', '').replace('_Properties.json', '').replace('.json', '').replace(/_/g, ' '),
    filename: f
  }));

  const fittingTypes = Array.from(new Set(fittings.map((f: any) => f.description.split(' - ')[0] || f.description))) as string[]; fittingTypes.sort();
  const fittingSizes = Array.from(new Set(fittings.map((f: any) => f.size_imperial))) as string[]; fittingSizes.sort();

  return (
    <div className="container py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">System Pressure Drop Simulator</h1>
      <p className="text-muted-foreground mb-8">
        Build a pipe network by adding pipe segments and fittings. Define the fluid properties and flow rate to compute the total end-to-end friction loss.
      </p>
      
      <SystemSimulatorClient 
        pipeOptions={pipeOptions} 
        fluidOptions={fluidOptions} 
        fittings={fittings}
        fittingTypes={fittingTypes}
        fittingSizes={fittingSizes}
      />
    </div>
  );
}
