'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SpeedOfSoundCalc() {
  const [tempC, setTempC] = useState<string>('20');
  const [tempF, setTempF] = useState<string>('68');
  const [velocityMS, setVelocityMS] = useState<string>('');
  const [velocityFTS, setVelocityFTS] = useState<string>('');

  // Calculate whenever C changes
  useEffect(() => {
    if (tempC === '') {
      setVelocityMS('');
      return;
    }
    const tC = parseFloat(tempC);
    if (!isNaN(tC)) {
      // vms = 20.05 * (273.16 + tC)^0.5
      const v = 20.05 * Math.sqrt(273.16 + tC);
      setVelocityMS(v.toFixed(2));
      
      // Update F for display
      const tF = (tC * 9/5) + 32;
      setTempF(tF.toFixed(1));
    }
  }, [tempC]);

  // Calculate whenever F changes
  useEffect(() => {
    if (tempF === '') {
      setVelocityFTS('');
      return;
    }
    const tF = parseFloat(tempF);
    if (!isNaN(tF)) {
      // vfts = 49.03 * (459.7 + tF)^0.5
      const v = 49.03 * Math.sqrt(459.7 + tF);
      setVelocityFTS(v.toFixed(2));
    }
  }, [tempF]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* SI Units Card */}
      <div className="border rounded-xl p-6 bg-card shadow-sm">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">SI Units (°C / m/s)</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="temp-c">Temperature (°C)</Label>
            <Input 
              id="temp-c" 
              type="number" 
              value={tempC} 
              onChange={(e) => setTempC(e.target.value)} 
              placeholder="e.g. 20"
            />
          </div>
          
          <div className="space-y-2 pt-4">
            <Label className="text-muted-foreground">Speed of Sound in Air</Label>
            <div className="text-4xl font-bold text-primary">
              {velocityMS ? `${velocityMS} m/s` : '-- m/s'}
            </div>
            <p className="text-xs text-muted-foreground">Formula: v = 20.05 × √(273.16 + T)</p>
          </div>
        </div>
      </div>

      {/* Imperial Units Card */}
      <div className="border rounded-xl p-6 bg-card shadow-sm">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Imperial Units (°F / ft/s)</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="temp-f">Temperature (°F)</Label>
            <Input 
              id="temp-f" 
              type="number" 
              value={tempF} 
              onChange={(e) => setTempF(e.target.value)} 
              placeholder="e.g. 68"
            />
          </div>
          
          <div className="space-y-2 pt-4">
            <Label className="text-muted-foreground">Speed of Sound in Air</Label>
            <div className="text-4xl font-bold text-primary">
              {velocityFTS ? `${velocityFTS} ft/s` : '-- ft/s'}
            </div>
            <p className="text-xs text-muted-foreground">Formula: v = 49.03 × √(459.7 + T)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
