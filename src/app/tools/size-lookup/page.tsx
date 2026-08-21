import React from 'react';
import fs from 'fs';
import path from 'path';
import { SizeLookupClient } from './SizeLookupClient';

export const metadata = {
  title: 'Pipe Size Lookup | MEPKit',
  description: 'Instantly lookup outer diameter, wall thickness, and weight for any nominal pipe size and schedule.',
};

export default async function SizeLookupPage() {
  // Read all pipe table files
  const pipesDir = path.join(process.cwd(), 'public', 'data', 'pipes');
  const files = fs.existsSync(pipesDir) ? fs.readdirSync(pipesDir) : [];
  
  // Format the options (e.g. "Steel Ansi Sch40" from "PipeTables_Steel_Ansi_Sch40.json")
  const pipeOptions = files
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const name = f.replace('PipeTables_', '').replace('.json', '').replace(/_/g, ' ');
      return { label: name, filename: f };
    });

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Pipe Size Lookup Tool</h1>
      <p className="text-muted-foreground mb-8">
        Select a pipe material and schedule, then choose a nominal size to retrieve physical dimensions and weights.
      </p>
      
      <SizeLookupClient options={pipeOptions} />
    </div>
  );
}
