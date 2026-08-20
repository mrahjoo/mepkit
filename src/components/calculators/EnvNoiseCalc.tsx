'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EnvNoiseCalc() {
  // Noise levels
  const [ld, setLd] = useState<string>('55');
  const [le, setLe] = useState<string>('50');
  const [ln, setLn] = useState<string>('45');

  // Hours
  const [td, setTd] = useState<string>('12');
  const [te, setTe] = useState<string>('4');
  const [tn, setTn] = useState<string>('8');

  // Result
  const [lden, setLden] = useState<string>('');

  useEffect(() => {
    const valLd = parseFloat(ld);
    const valLe = parseFloat(le);
    const valLn = parseFloat(ln);
    const valTd = parseFloat(td);
    const valTe = parseFloat(te);
    const valTn = parseFloat(tn);

    if (
      !isNaN(valLd) && !isNaN(valLe) && !isNaN(valLn) &&
      !isNaN(valTd) && !isNaN(valTe) && !isNaN(valTn) &&
      (valTd + valTe + valTn) > 0
    ) {
      // Lden = 10 log[ (1 / 24) (td 10^(Ld/10) + te 10^((Le + 5)/10) + tn 10^((Ln + 10)/10)) ]
      // Note: we use (valTd + valTe + valTn) instead of hardcoded 24 to support custom total hours, 
      // but usually it's 24.
      const totalHours = valTd + valTe + valTn;
      
      const dayEnergy = valTd * Math.pow(10, valLd / 10);
      const eveningEnergy = valTe * Math.pow(10, (valLe + 5) / 10);
      const nightEnergy = valTn * Math.pow(10, (valLn + 10) / 10);
      
      const sum = (1 / totalHours) * (dayEnergy + eveningEnergy + nightEnergy);
      const result = 10 * Math.log10(sum);
      
      setLden(result.toFixed(2));
    } else {
      setLden('');
    }
  }, [ld, le, ln, td, te, tn]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Calculator Card */}
      <div className="border rounded-xl p-6 bg-card shadow-sm">
        <h3 className="text-2xl font-bold mb-6 border-b pb-4">Calculate L_den</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ld">Day Exposure L_d (dBA)</Label>
                <Input id="ld" type="number" value={ld} onChange={(e) => setLd(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="td">Day Hours</Label>
                <Input id="td" type="number" value={td} onChange={(e) => setTd(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="le">Evening Exposure L_e (dBA)</Label>
                <Input id="le" type="number" value={le} onChange={(e) => setLe(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="te">Evening Hours</Label>
                <Input id="te" type="number" value={te} onChange={(e) => setTe(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ln">Night Exposure L_n (dBA)</Label>
                <Input id="ln" type="number" value={ln} onChange={(e) => setLn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tn">Night Hours</Label>
                <Input id="tn" type="number" value={tn} onChange={(e) => setTn(e.target.value)} />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground pt-2">
              Note: Evening exposure is penalized by +5 dB, and Night exposure by +10 dB automatically in the formula.
            </p>
          </div>
          
          <div className="flex flex-col justify-center items-center p-6 bg-muted/30 rounded-lg border">
            <Label className="text-muted-foreground text-lg mb-4">Cumulative Exposure (L_den)</Label>
            <div className="text-6xl font-bold text-primary">
              {lden ? `${lden}` : '--'}
            </div>
            <div className="text-xl text-muted-foreground mt-2">dBA</div>
          </div>
        </div>
      </div>

      {/* Reference Table Card */}
      <div className="border rounded-xl p-6 bg-card shadow-sm">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Permissible Cumulative Exposure (L_den) Values</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3 text-right">Day (dBA)</th>
                <th className="px-4 py-3 text-right">Night (dBA)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-muted/50"><td className="px-4 py-2 font-medium">Purely industrial</td><td className="px-4 py-2 text-right">70</td><td className="px-4 py-2 text-right">70</td></tr>
              <tr className="hover:bg-muted/50"><td className="px-4 py-2 font-medium">Predominant commercial and industrial</td><td className="px-4 py-2 text-right">65</td><td className="px-4 py-2 text-right">50</td></tr>
              <tr className="hover:bg-muted/50"><td className="px-4 py-2 font-medium">Mixed areas</td><td className="px-4 py-2 text-right">60</td><td className="px-4 py-2 text-right">45</td></tr>
              <tr className="hover:bg-muted/50"><td className="px-4 py-2 font-medium">Predominant residential</td><td className="px-4 py-2 text-right">55</td><td className="px-4 py-2 text-right">40</td></tr>
              <tr className="hover:bg-muted/50"><td className="px-4 py-2 font-medium">Purely residential</td><td className="px-4 py-2 text-right">50</td><td className="px-4 py-2 text-right">35</td></tr>
              <tr className="hover:bg-muted/50"><td className="px-4 py-2 font-medium">Hospitals etc.</td><td className="px-4 py-2 text-right">45</td><td className="px-4 py-2 text-right">35</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
