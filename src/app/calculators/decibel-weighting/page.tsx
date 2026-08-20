import React from 'react';
import { DecibelWeightingCalc } from '@/components/calculators/DecibelWeightingCalc';

export const metadata = {
  title: 'Decibel A, B, and C Weighting Calculator | MEPKit',
  description: 'Apply A, B, and C weighting filters to octave-band sound pressure measurements and calculate logarithmic totals.',
};

export default function DecibelWeightingPage() {
  return (
    <div className="container py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Decibel A, B, and C Weighting</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        Sound pressure filters compensate for the sensitivity of the human ear, which is most sensitive to sounds in the 1 to 4 kHz range.
        Enter your raw measurements below to apply the standard A, B, and C weighting curves.
      </p>
      
      <DecibelWeightingCalc />
    </div>
  );
}
