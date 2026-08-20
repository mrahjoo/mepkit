import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Engineering Charts & Graphs | MEPKit',
  description: 'Interactive charts and visual data for various engineering and fluid properties.',
};

export default function ChartsCategoryPage() {
  // We can eventually build dedicated standalone chart pages. 
  // For now, we link to fluid properties which contain interactive charts.
  const charts = [
    { 
      title: 'Water Properties Chart', 
      href: '/tables/fluids/Water', 
      desc: 'Visualize water density and viscosity vs. temperature.' 
    },
    { 
      title: 'Air Properties Chart', 
      href: '/tables/fluids/Air', 
      desc: 'Visualize air density and viscosity vs. temperature.' 
    },
  ];

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Engineering Charts</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Interactive visual representations of engineering data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map(c => (
          <Link href={c.href} key={c.title} className="block group">
            <div className="border rounded-xl p-6 h-full bg-card hover:border-primary transition-colors shadow-sm hover:shadow-md">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">{c.title}</h2>
              <p className="text-muted-foreground">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
