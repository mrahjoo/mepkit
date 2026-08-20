'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AcousticImpedanceCalc() {
  const [density, setDensity] = useState<string>('1.2'); // Air default kg/m3
  const [velocity, setVelocity] = useState<string>('343'); // Air default m/s
  const [impedance, setImpedance] = useState<string>('');

  useEffect(() => {
    if (density === '' || velocity === '') {
      setImpedance('');
      return;
    }
    const d = parseFloat(density);
    const v = parseFloat(velocity);
    
    if (!isNaN(d) && !isNaN(v)) {
      // Z = p * c
      const z = d * v;
      setImpedance(z.toFixed(2));
    }
  }, [density, velocity]);

  return (
    <div className="max-w-xl mx-auto border rounded-xl p-6 bg-card shadow-sm">
      <h3 className="text-2xl font-bold mb-6 border-b pb-4">Calculate Acoustic Impedance</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="density">Density of Medium (ρ) [kg/m³]</Label>
          <Input 
            id="density" 
            type="number" 
            value={density} 
            onChange={(e) => setDensity(e.target.value)} 
            placeholder="e.g. 1.2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="velocity">Velocity of Sound (c) [m/s]</Label>
          <Input 
            id="velocity" 
            type="number" 
            value={velocity} 
            onChange={(e) => setVelocity(e.target.value)} 
            placeholder="e.g. 343"
          />
        </div>
        
        <div className="space-y-2 pt-6 border-t mt-6">
          <Label className="text-muted-foreground text-lg">Specific Acoustic Impedance (Z)</Label>
          <div className="text-5xl font-bold text-primary">
            {impedance ? `${impedance} ` : '-- '}
            <span className="text-2xl text-muted-foreground">Pa·s/m</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Formula: Z = ρ × c</p>
          <p className="text-sm text-muted-foreground">
            Also known as Rayls. It expresses the coupling between the vibrating particles in the medium.
          </p>
        </div>
      </div>
    </div>
  );
}
