import React from 'react';
import { PipePressureDropCalc } from '@/components/calculators/PipePressureDropCalc';

export default function PipePressureDropPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-4 text-center">Pressure Drop Calculator</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        Calculate the pressure loss in a pipe system using the Darcy-Weisbach equation. 
        This calculator integrates directly with our fluid and pipe data tables.
      </p>
      
      <PipePressureDropCalc />
    </div>
  );
}
