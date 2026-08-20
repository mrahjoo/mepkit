import React from 'react';
import fs from 'fs';
import path from 'path';
import { FluidTable, FluidData } from '@/components/tables/FluidTable';
import { FluidPropertyChart } from '@/components/charts/FluidPropertyChart';

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'fluids');
  const files = fs.readdirSync(dir);
  return files.map(file => ({
    fluid: file.replace('FluidTables_', '').replace('_Properties.json', '').replace('.json', '')
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ fluid: string }> }) {
  const { fluid } = await params;
  const formattedFluid = fluid.replace(/([A-Z])/g, ' $1').trim();
  return {
    title: `${formattedFluid} Properties & Charts - MEPKit`,
    description: `Engineering data, charts, and tables for ${formattedFluid} properties including density and dynamic viscosity across temperatures.`,
  };
}

export default async function FluidPropertyPage({ params }: { params: Promise<{ fluid: string }> }) {
  const { fluid } = await params;
  
  // Try to find the exact file name since some don't have "_Properties"
  const dir = path.join(process.cwd(), 'public', 'data', 'fluids');
  const files = fs.readdirSync(dir);
  const targetFile = files.find(f => f.includes(fluid));

  if (!targetFile) {
    return <div>Fluid not found</div>;
  }

  const filePath = path.join(dir, targetFile);
  const data: FluidData[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const fluidName = fluid.replace(/([A-Z])/g, ' $1').trim(); // Basic formatting

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${fluidName} Engineering Properties`,
    "description": `Data table and charts containing density and viscosity for ${fluidName}.`,
    "provider": {
      "@type": "Organization",
      "name": "MEPKit"
    }
  };

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold mb-4">{fluidName} Properties</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Reference table and property charts for {fluidName} across various temperatures.
      </p>
      
      <div className="mb-12 border rounded-xl p-6 bg-card">
        <FluidPropertyChart data={data} fluidName={fluidName} />
      </div>

      <FluidTable 
        data={data} 
        title={`${fluidName} Data Table`} 
        description="Detailed density, viscosity, and vapor pressure values." 
      />
    </div>
  );
}
