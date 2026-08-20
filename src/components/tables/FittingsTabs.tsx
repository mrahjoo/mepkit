'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FittingTable, FittingData } from './FittingTable';

const CATEGORIES = [
  {
    id: 'bends',
    label: 'Bends & Elbows',
    match: ['Bend', 'Elbow'],
  },
  {
    id: 'valves',
    label: 'Valves',
    match: ['Gate Valve', 'Globe Valve', 'Plug Valve', 'Butterfly Valve', 'Ball Valve'],
  },
  {
    id: 'checks',
    label: 'Check & Foot Valves',
    match: ['Check Valve', 'Foot Valve', 'Tilting Disk'],
  },
  {
    id: 'tees-strainers',
    label: 'Tees & Strainers',
    match: ['Tee', 'Strainer'],
  },
  {
    id: 'entries-exits',
    label: 'Entries & Exits',
    match: ['Entry', 'Exit'],
  },
];

export function FittingsTabs({ data }: { data: FittingData[] }) {
  // Helper to filter data by category match keywords
  const filterData = (keywords: string[]) => {
    return data.filter(d => keywords.some(kw => d.description.includes(kw)));
  };

  return (
    <Tabs defaultValue="bends" className="w-full">
      <TabsList className="flex flex-wrap h-auto justify-start mb-6 w-full">
        {CATEGORIES.map(cat => (
          <TabsTrigger key={cat.id} value={cat.id} className="text-sm">
            {cat.label}
          </TabsTrigger>
        ))}
        <TabsTrigger value="all" className="text-sm">
          All Fittings
        </TabsTrigger>
      </TabsList>

      {CATEGORIES.map(cat => (
        <TabsContent key={cat.id} value={cat.id}>
          <div className="bg-card border rounded-lg p-4">
            <FittingTable 
              data={filterData(cat.match)} 
              title={cat.label} 
              description={`Data for ${cat.label.toLowerCase()}`}
            />
          </div>
        </TabsContent>
      ))}

      <TabsContent value="all">
        <div className="bg-card border rounded-lg p-4">
          <FittingTable 
            data={data} 
            title="All Fittings" 
            description="Complete un-filtered list of all pipe fittings and valves."
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
