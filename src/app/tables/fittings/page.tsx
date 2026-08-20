import React from 'react';
import fs from 'fs';
import path from 'path';
import { FittingData } from '@/components/tables/FittingTable';
import { FittingsTabs } from '@/components/tables/FittingsTabs';

export const metadata = {
  title: 'Pipe Fittings & Valves K-Factors | MEPKit',
  description: 'Reference tables for pipe fitting descriptions, codes, and friction loss coefficients (K-Factors).',
};

export default function FittingsPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'fittings', 'FittingTables_Pfn_Fittings.json');
  
  if (!fs.existsSync(filePath)) {
    return <div>Fittings data not found</div>;
  }

  const data: FittingData[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">Pipe Fittings Data</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Reference table for pipe fitting descriptions, codes, and their respective K-Factors (friction loss coefficients). Select a category below.
      </p>
      
      <FittingsTabs data={data} />
    </div>
  );
}
