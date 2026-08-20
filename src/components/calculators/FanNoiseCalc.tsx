'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const FAN_TYPES = {
  'centrifugal_backward': { name: 'Centrifugal fan, backward-curved blades', mods: [-4, -6, -9, -11, -13, -16, -19, -22] },
  'centrifugal_forward': { name: 'Centrifugal fan, forward-curved blades', mods: [-2, -6, -13, -18, -19, -22, -25, -30] },
  'centrifugal_radial': { name: 'Centrifugal fan, straight radial blades', mods: [-3, -5, -7, -7, -8, -11, -16, -18] },
  'axial': { name: 'Axial fan', mods: [-7, -9, -7, -7, -8, -11, -16, -18] },
};

const OCTAVES = [63, 125, 250, 500, 1000, 2000, 4000, 8000];

export function FanNoiseCalc() {
  const [isImperial, setIsImperial] = useState(false);
  const [calcMethod, setCalcMethod] = useState<'power_pressure' | 'volume_pressure' | 'power_volume'>('power_pressure');
  
  // Inputs
  const [power, setPower] = useState<string>('');
  const [pressure, setPressure] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  
  const [fanType, setFanType] = useState<keyof typeof FAN_TYPES>('centrifugal_backward');

  // Outputs
  const [ln, setLn] = useState<number | null>(null);

  useEffect(() => {
    let result = null;
    const s = parseFloat(power);
    const p = parseFloat(pressure);
    const q = parseFloat(volume);

    if (calcMethod === 'power_pressure' && !isNaN(s) && !isNaN(p) && s > 0 && p > 0) {
      if (isImperial) {
        // LN = 90 + 10 log(s) + 10 log(h)
        result = 90 + 10 * Math.log10(s) + 10 * Math.log10(p);
      } else {
        // LN = 67 + 10 log(S) + 10 log(p)
        result = 67 + 10 * Math.log10(s) + 10 * Math.log10(p);
      }
    } else if (calcMethod === 'volume_pressure' && !isNaN(q) && !isNaN(p) && q > 0 && p > 0) {
      if (isImperial) {
        // LN = 55 + 10 log(q) + 20 log(h)
        result = 55 + 10 * Math.log10(q) + 20 * Math.log10(p);
      } else {
        // LN = 40 + 10 log(Q)+ 20 log(p)
        result = 40 + 10 * Math.log10(q) + 20 * Math.log10(p);
      }
    } else if (calcMethod === 'power_volume' && !isNaN(s) && !isNaN(q) && s > 0 && q > 0) {
      if (isImperial) {
        // LN = 125 + 20 log(s) - 10 log(q)
        result = 125 + 20 * Math.log10(s) - 10 * Math.log10(q);
      } else {
        // LN = 94 + 20 log(S) - 10 log(Q)
        result = 94 + 20 * Math.log10(s) - 10 * Math.log10(q);
      }
    }

    setLn(result);
  }, [power, pressure, volume, calcMethod, isImperial]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
        <div className="flex items-center space-x-2">
          <Switch 
            id="unit-toggle" 
            checked={isImperial} 
            onCheckedChange={setIsImperial} 
          />
          <Label htmlFor="unit-toggle" className="font-semibold cursor-pointer">
            {isImperial ? 'Imperial Units' : 'SI Units'}
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label>Calculate using:</Label>
          <Select value={calcMethod} onValueChange={(val: any) => setCalcMethod(val)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="power_pressure">Motor Power & Static Pressure</SelectItem>
              <SelectItem value="volume_pressure">Volume Discharged & Static Pressure</SelectItem>
              <SelectItem value="power_volume">Motor Power & Volume Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
          <h3 className="text-xl font-semibold border-b pb-2">Inputs</h3>
          
          {(calcMethod === 'power_pressure' || calcMethod === 'power_volume') && (
            <div className="space-y-2">
              <Label>Rated Motor Power ({isImperial ? 'hp' : 'kW'})</Label>
              <Input type="number" placeholder="e.g. 5" value={power} onChange={(e) => setPower(e.target.value)} />
            </div>
          )}

          {(calcMethod === 'power_pressure' || calcMethod === 'volume_pressure') && (
            <div className="space-y-2">
              <Label>Fan Static Pressure ({isImperial ? 'in wg' : 'Pa'})</Label>
              <Input type="number" placeholder={isImperial ? "e.g. 2" : "e.g. 500"} value={pressure} onChange={(e) => setPressure(e.target.value)} />
            </div>
          )}

          {(calcMethod === 'volume_pressure' || calcMethod === 'power_volume') && (
            <div className="space-y-2">
              <Label>Volume Discharged ({isImperial ? 'cfm' : 'm³/s'})</Label>
              <Input type="number" placeholder={isImperial ? "e.g. 1000" : "e.g. 2"} value={volume} onChange={(e) => setVolume(e.target.value)} />
            </div>
          )}
        </div>

        {/* Base Result Card */}
        <div className="flex flex-col justify-center items-center p-6 bg-muted/30 rounded-xl border shadow-sm">
          <Label className="text-muted-foreground text-lg mb-4">Base Sound Power Level (L_N)</Label>
          <div className="text-6xl font-bold text-primary">
            {ln !== null ? ln.toFixed(1) : '--'}
          </div>
          <div className="text-xl text-muted-foreground mt-2">dB</div>
        </div>
      </div>

      {/* Octave Band Analysis */}
      <div className="border rounded-xl p-6 bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <h3 className="text-xl font-semibold">Octave Band Sound Power Level</h3>
          <div className="flex items-center space-x-2">
            <Label>Fan Type:</Label>
            <Select value={fanType} onValueChange={(val: any) => setFanType(val)}>
              <SelectTrigger className="w-[320px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FAN_TYPES).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-xs uppercase bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Frequency (Hz)</th>
                {OCTAVES.map(oct => (
                  <th key={oct} className="px-4 py-3">{oct}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-left">Modifier (dB)</td>
                {FAN_TYPES[fanType].mods.map((mod, i) => (
                  <td key={i} className="px-4 py-3 text-muted-foreground">{mod}</td>
                ))}
              </tr>
              <tr className="hover:bg-muted/50 font-semibold text-primary">
                <td className="px-4 py-4 text-left">Predicted L_N (dB)</td>
                {FAN_TYPES[fanType].mods.map((mod, i) => (
                  <td key={i} className="px-4 py-4">
                    {ln !== null ? (ln + mod).toFixed(1) : '--'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
