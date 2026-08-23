import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CSVTable } from '@/components/tables/CSVTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Image from 'next/image';

interface Props {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  const catalogPath = path.join(process.cwd(), 'public', 'data', 'pipedata_catalog.json');
  if (!fs.existsSync(catalogPath)) return [];
  
  const catalog: { id: string, category: string }[] = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  return catalog.map(item => ({
    category: item.category,
    id: item.id,
  }));
}

export default async function ComponentDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const { category, id } = resolvedParams;
  
  const dataPath = path.join(process.cwd(), 'public', 'data', 'pipedata', `${id}.json`);
  if (!fs.existsSync(dataPath)) {
    notFound();
  }

  const { headers, rows } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Find assets
  const assetsDir = path.join(process.cwd(), 'public', 'pipedata_assets');
  let imageFile: string | null = null;
  let dxfFile: string | null = null;

  // Since we don't know exactly what images map to what, we can check a few conventions
  // such as [id].png, [category].png, or some generic images.
  const possibleImages = [
    `${id}.png`, `${id}.svg`, `${id}.jpg`, 
    `${category}.png`, `${category}.svg`
  ];
  
  for (const img of possibleImages) {
    if (fs.existsSync(path.join(assetsDir, img))) {
      imageFile = `/pipedata_assets/${img}`;
      break;
    }
  }

  // Check for dxf
  if (fs.existsSync(path.join(assetsDir, `${id}.dxf`))) {
    dxfFile = `/pipedata_assets/${id}.dxf`;
  }

  return (
    <div className="container py-10 max-w-6xl mx-auto space-y-8">
      <div>
        <Link href="/components" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Component Library
        </Link>
        <h1 className="text-3xl font-bold uppercase">{id}</h1>
        <p className="text-muted-foreground capitalize">Category: {category}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 overflow-x-auto border rounded-lg p-1 bg-card">
          <CSVTable title={id} description={`Dimensions and specifications for ${id}`} headers={headers} data={rows} />
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-card flex flex-col items-center text-center space-y-4">
            <h3 className="font-semibold text-lg">Diagram</h3>
            {imageFile ? (
              <div className="relative w-full aspect-square bg-white rounded-md flex items-center justify-center p-4">
                <Image 
                  src={imageFile} 
                  alt={`${id} diagram`} 
                  fill
                  className="object-contain" 
                  unoptimized // In case they are SVG or large images we just want to serve raw
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">No diagram available</span>
              </div>
            )}
            
            {dxfFile ? (
              <Button  className="w-full" variant="outline">
                <a href={dxfFile} download>
                  <Download className="mr-2 h-4 w-4" /> Download CAD (.dxf)
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" /> DXF Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
