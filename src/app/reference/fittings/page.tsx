import React from 'react';
import fs from 'fs';
import path from 'path';
import { FittingTable, FittingData } from '@/components/tables/FittingTable';

export default function FittingsPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'fittings', 'FittingTables_Pfn_Fittings.json');
  
  if (!fs.existsSync(filePath)) {
    return <div>Fittings data not found</div>;
  }

  const data: FittingData[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4">Pipe Fittings Data</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Reference table for pipe fitting descriptions, codes, and their respective K-Factors (friction loss coefficients).
      </p>
      
      <FittingTable 
        data={data} 
        title="Fittings & Valves" 
        description="Standard pipe fittings and their K-Factors." 
      />
    </div>
  );
}
