import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Engineering Data Tables | MEPKit',
  description: 'Browse our comprehensive collection of engineering data tables including pipes, fluids, and fittings.',
};

export default function TablesCategoryPage() {
  const categories = [
    { title: 'Pipe Specifications', href: '/tables/pipes/Aluminium_Sch40', desc: 'Inner dimensions, weights, and thickness for all pipe schedules.' },
    { title: 'Fluid Properties', href: '/tables/fluids/Water', desc: 'Density, viscosity, and vapor pressure across temperatures.' },
    { title: 'Fittings & Valves', href: '/tables/fittings', desc: 'Friction loss coefficients (K-Factors) for various fittings.' },
    { title: 'Component Library', href: '/components', desc: 'Extensive raw data for flanges, valves, olets, blanks, loops, etc.' },
  ];

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Engineering Data Tables</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Select a category below to explore our extensive database of engineering properties.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(c => (
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
