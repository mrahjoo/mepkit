import React from 'react';
import fs from 'fs';
import path from 'path';
import { PipeTable, PipeData } from '@/components/tables/PipeTable';

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'public', 'data', 'pipes');
  const files = fs.readdirSync(dir);
  return files.map(file => ({
    material: file.replace('PipeTables_', '').replace('.json', '')
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ material: string }> }) {
  const { material } = await params;
  const formattedMaterial = material.replace(/_/g, ' ');
  return {
    title: `${formattedMaterial} Pipe Dimensions & Properties - MEPKit`,
    description: `Engineering data table for ${formattedMaterial} pipes including inner diameter, outer diameter, wall thickness, and weight per foot.`,
  };
}

export default async function PipeMaterialPage({ params }: { params: Promise<{ material: string }> }) {
  const { material } = await params;
  const fileName = `PipeTables_${material}.json`;
  const filePath = path.join(process.cwd(), 'public', 'data', 'pipes', fileName);
  
  if (!fs.existsSync(filePath)) {
    return <div>Material not found</div>;
  }

  const data: PipeData[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const formattedMaterial = material.replace(/_/g, ' ');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${formattedMaterial} Pipe Dimensions`,
    "description": `Data table containing specifications for ${formattedMaterial} pipe schedules.`,
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
      <h1 className="text-4xl font-bold mb-4">{formattedMaterial} Pipe Data</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Reference table for {formattedMaterial} pipe dimensions and properties.
      </p>
      
      <PipeTable 
        data={data} 
        title={`${material.replace(/_/g, ' ')} Dimensions`} 
        description="Inner dimensions, outer diameter, and weights." 
      />
    </div>
  );
}
