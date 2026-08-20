import React from 'react';
import { SpeedOfSoundCalc } from '@/components/calculators/SpeedOfSoundCalc';

export const metadata = {
  title: 'Speed of Sound in Air Calculator | MEPKit',
  description: 'Calculate the speed of sound in air based on temperature in Celsius or Fahrenheit.',
};

export default function SpeedOfSoundPage() {
  return (
    <div className="container py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Speed of Sound in Air</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        Calculate the velocity of sound in air at standard atmospheric pressure based on temperature.
      </p>
      
      <SpeedOfSoundCalc />
    </div>
  );
}
