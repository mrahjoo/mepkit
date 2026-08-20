import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Engineering Calculators | MEPKit',
  description: 'Interactive engineering calculators for fluid dynamics, pipe flow, and pressure drop.',
};

export default function CalculatorsCategoryPage() {
  const calculators = [
    { 
      title: 'Pipe Pressure Drop', 
      href: '/calculators/pipe-pressure-drop', 
      desc: 'Calculate friction loss in a pipe system using the Darcy-Weisbach equation.' 
    },
    { 
      title: 'Specific Acoustic Impedance', 
      href: '/calculators/acoustic-impedance', 
      desc: 'Measure the ability of a medium to transmit sound waves (Rayls).' 
    },
    { 
      title: 'Speed of Sound in Air', 
      href: '/calculators/speed-of-sound', 
      desc: 'Calculate the velocity of sound in air based on ambient temperature.' 
    },
    { 
      title: 'Decibel Calculator (dB)', 
      href: '/calculators/decibel', 
      desc: 'Calculate logarithmic ratios for signal power, intensity, and amplitude.' 
    },
  ];

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Engineering Calculators</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Use our interactive tools to solve complex MEP engineering problems quickly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map(c => (
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
