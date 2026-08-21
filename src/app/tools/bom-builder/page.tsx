import React from 'react';
import fs from 'fs';
import path from 'path';
import { BOMBuilderClient } from './BOMBuilderClient';

export const metadata = {
  title: 'Bill of Materials Builder | MEPKit',
  description: 'Assemble a piping system and aggregate total weights and components.',
};

export default async function BOMBuilderPage() {
  const catalogPath = path.join(process.cwd(), 'public', 'data', 'pipedata_catalog.json');
  let catalog: { id: string, category: string, filename: string }[] = [];
  
  if (fs.existsSync(catalogPath)) {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  }

  const pipesDir = path.join(process.cwd(), 'public', 'data', 'pipes');
  const pipeFiles = fs.existsSync(pipesDir) ? fs.readdirSync(pipesDir) : [];
  const pipeOptions = pipeFiles.filter(f => f.endsWith('.json')).map(f => ({
    label: f.replace('PipeTables_', '').replace('.json', '').replace(/_/g, ' '),
    filename: f
  }));

  return (
    <div className="container py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Bill of Materials (BOM) Builder</h1>
      <p className="text-muted-foreground mb-8">
        Add components from the library and standard pipes to your BOM. The total weight will be automatically aggregated.
      </p>
      
      <BOMBuilderClient catalog={catalog} pipeOptions={pipeOptions} />
    </div>
  );
}
