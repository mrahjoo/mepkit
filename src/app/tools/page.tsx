import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Engineering Tools | MEPKit',
  description: 'Interactive engineering tools for building BOMs, sizing pipes, and simulating pressure drops.',
};

export default function ToolsCategoryPage() {
  const tools = [
    { 
      title: 'Pipe Size Lookup', 
      href: '/tools/size-lookup', 
      desc: 'Instantly lookup outer diameter, wall thickness, and weight for any nominal pipe size and schedule.' 
    },
    { 
      title: 'Fitting & Valve Selector', 
      href: '/tools/fitting-selector', 
      desc: 'Search and filter fittings and valves by nominal size and type to find K-factors.' 
    },
    { 
      title: 'Bill of Materials Builder', 
      href: '/tools/bom-builder', 
      desc: 'Assemble a piping system and aggregate total weights and components.' 
    },
    { 
      title: 'System Pressure Drop Simulator', 
      href: '/tools/system-simulator', 
      desc: 'Build a simple pipe network (segments + fittings) to compute total friction loss end-to-end.' 
    },
  ];

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Engineering Tools</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Use our interactive tools to streamline your engineering workflows.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(t => (
          <Link href={t.href} key={t.title} className="block group">
            <div className="border rounded-xl p-6 h-full bg-card hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">{t.title}</h2>
              <p className="text-muted-foreground">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
