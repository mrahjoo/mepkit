import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { ToolConfig } from '@/lib/tool-schema';
import { ToolsList } from '@/components/tools/ToolsList';

export const metadata = {
  title: 'Engineering Tools | MEPKit',
  description: 'Search and browse thousands of data-driven engineering tools, calculators, and data tables for MEP engineers.',
};

async function getToolsList() {
  try {
    const toolsDir = path.join(process.cwd(), 'data', 'tools');
    
    try {
      await fs.access(toolsDir);
    } catch {
      await fs.mkdir(toolsDir, { recursive: true });
      return [];
    }
    
    const files = await fs.readdir(toolsDir);
    const tools = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(toolsDir, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        try {
          const config = JSON.parse(fileContents) as ToolConfig;
          tools.push({
            slug: file.replace('.json', ''),
            title: config.title,
            description: config.description || 'Engineering calculation tool.',
            type: config.type || 'calculator'
          });
        } catch (e) {
          console.error(`Error parsing ${file}:`, e);
        }
      }
    }

    return tools.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error reading tools directory:', error);
    return [];
  }
}

export default async function ToolsHubPage() {
  const tools = await getToolsList();
  
  const staticTools = [
    { 
      title: 'Pipe Size Lookup', 
      slug: 'size-lookup', 
      description: 'Instantly lookup outer diameter, wall thickness, and weight for any nominal pipe size and schedule.',
      type: 'static'
    },
    { 
      title: 'Fitting & Valve Selector', 
      slug: 'fitting-selector', 
      description: 'Search and filter fittings and valves by nominal size and type to find K-factors.',
      type: 'static'
    },
    { 
      title: 'Bill of Materials Builder', 
      slug: 'bom-builder', 
      description: 'Assemble a piping system and aggregate total weights and components.',
      type: 'static'
    },
    { 
      title: 'System Pressure Drop Simulator', 
      slug: 'system-simulator', 
      description: 'Build a simple pipe network (segments + fittings) to compute total friction loss end-to-end.',
      type: 'static'
    },
  ];

  const allTools = [...staticTools, ...tools];

  return (
    <div className="container py-10 px-4 md:px-8">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center tracking-tight">Engineering Tools</h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        Search and browse our extensive collection of {allTools.length > 0 ? allTools.length : ''} data-driven engineering calculators, charts, and reference tables.
      </p>

      <ToolsList initialTools={allTools} />
    </div>
  );
}
