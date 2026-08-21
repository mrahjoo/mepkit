import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Pipe Components Data | MEPKit',
  description: 'Extensive raw data tables for pipe components including flanges, valves, olets, blanks, loops, and more.',
};

export default function PipeDataCategoryPage() {
  const dir = path.join(process.cwd(), 'data', 'PipeDataCSV');
  let files: string[] = [];
  
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Pipe Components Data</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Select a component below to view its extensive specification data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {files.map(file => (
          <Link href={`/tables/pipedata/${encodeURIComponent(file)}`} key={file} className="block group">
            <div className="border rounded-xl p-4 h-full bg-card hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <h2 className="text-sm font-medium group-hover:text-primary truncate">{file.replace('.csv', '')}</h2>
            </div>
          </Link>
        ))}
      </div>
      
      {files.length === 0 && (
        <p className="text-muted-foreground">No data files found.</p>
      )}
    </div>
  );
}
