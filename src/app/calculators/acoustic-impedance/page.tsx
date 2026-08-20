import React from 'react';
import { AcousticImpedanceCalc } from '@/components/calculators/AcousticImpedanceCalc';

export const metadata = {
  title: 'Specific Acoustic Impedance Calculator | MEPKit',
  description: 'Calculate specific acoustic impedance of a medium using density and speed of sound.',
};

export default function AcousticImpedancePage() {
  return (
    <div className="container py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Specific Acoustic Impedance</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        Specific acoustic impedance is a measure of the ability of a medium to transmit sound waves. 
        It is derived from the density of the medium and the velocity of sound.
      </p>
      
      <AcousticImpedanceCalc />
    </div>
  );
}
