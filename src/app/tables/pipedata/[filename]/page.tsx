import React from 'react';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { CSVTable } from '@/components/tables/CSVTable';

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'data', 'PipeDataCSV');
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
  return files.map(file => ({
    filename: file,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  const name = decodedFilename.replace('.csv', '');
  return {
    title: `${name} Data | MEPKit`,
    description: `Engineering data table for ${name} pipe component.`,
  };
}

export default async function PipeDataComponentPage({ params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  const filePath = path.join(process.cwd(), 'data', 'PipeDataCSV', decodedFilename);
  
  if (!fs.existsSync(filePath)) {
    return <div>Component not found</div>;
  }

  const csvFile = fs.readFileSync(filePath, 'utf8');
  
  // Parse without headers to get 2D array
  const parsed = Papa.parse<string[]>(csvFile, {
    header: false,
    skipEmptyLines: true,
  });

  const rawData = parsed.data;

  if (rawData.length === 0) {
    return <div>Data is empty.</div>;
  }

  // Determine headers. Sometimes first line is numerical mapping, sometimes it's the actual header.
  // We'll just show everything. The CSVTable takes a header and data.
  // So we'll use the first row as the header, and the rest as data.
  const headers = rawData[0];
  const data = rawData.slice(1);

  const name = decodedFilename.replace('.csv', '');

  return (
    <CSVTable 
      title={`${name} Data`} 
      description={`Engineering data for ${name}.`}
      headers={headers}
      data={data}
    />
  );
}
