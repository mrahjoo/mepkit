import React from 'react';
import { EnvNoiseCalc } from '@/components/calculators/EnvNoiseCalc';

export const metadata = {
  title: 'EU Environmental Noise Directive Calculator | MEPKit',
  description: 'Calculate cumulative L_den noise exposure based on Day, Evening, and Night noise indicators according to the EU Directive.',
};

export default function EnvNoisePage() {
  return (
    <div className="container py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">EU Environmental Noise Directive</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        Calculate a person's cumulative 24-hour exposure to sound (L_den) using the EU Environmental Noise Directive formula for road, rail, and air traffic noise.
      </p>
      
      <EnvNoiseCalc />
    </div>
  );
}
