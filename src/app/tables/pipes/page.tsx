import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Pipe Materials Data Tables | MEPKit',
  description: 'Browse all available pipe materials for dimension and property data tables.',
};

export default function PipesIndexPage() {
  const directoryPath = path.join(process.cwd(), 'public', 'data', 'pipes');
  let files: string[] = [];

  try {
    files = fs.readdirSync(directoryPath);
  } catch (error) {
    console.error("Failed to read pipes directory", error);
  }

  // Filter JSON files and extract material names
  const materials = files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('PipeTables_', '').replace('.json', ''));

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">Pipe Data Tables</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Select a pipe material and schedule to view its dimensions, weight, and properties.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map(material => {
          const formatted = material.replace(/_/g, ' ');
          return (
            <Link href={`/tables/pipes/${material}`} key={material} className="group">
              <div className="border rounded-lg p-4 bg-card hover:bg-muted/50 hover:border-primary transition-colors flex items-center space-x-3">
                <FileText className="text-primary w-5 h-5 flex-shrink-0" />
                <span className="font-medium group-hover:text-primary transition-colors">{formatted}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
