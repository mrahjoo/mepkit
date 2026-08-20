import React from 'react';
import { DecibelCalc } from '@/components/calculators/DecibelCalc';

export const metadata = {
  title: 'Decibel Calculator (dB) | MEPKit',
  description: 'Calculate decibels (dB) for power ratios and amplitude ratios, or calculate absolute signal levels from decibels.',
};

export default function DecibelPage() {
  return (
    <div className="container py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Decibel Calculator</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        The decibel is a logarithmic unit used to describe the ratio of a signal level (power, intensity, or amplitude) to a reference level.
      </p>
      
      <DecibelCalc />
    </div>
  );
}
