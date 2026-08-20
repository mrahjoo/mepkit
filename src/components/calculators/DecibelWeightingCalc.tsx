'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const FREQUENCIES = [
  { freq: 31.25, a: -39.4, b: -17, c: -3 },
  { freq: 62.5, a: -26.2, b: -9, c: -0.8 },
  { freq: 125, a: -16.1, b: -4, c: -0.2 },
  { freq: 250, a: -8.6, b: -1, c: 0 },
  { freq: 500, a: -3.2, b: 0, c: 0 },
  { freq: 1000, a: 0, b: 0, c: 0 },
  { freq: 2000, a: 1.2, b: 0, c: -0.2 },
  { freq: 4000, a: 1, b: -1, c: -0.8 },
  { freq: 8000, a: -1.1, b: -3, c: -3 }
];

export function DecibelWeightingCalc() {
  // Store raw inputs mapped by frequency
  const [inputs, setInputs] = useState<Record<number, string>>({});
  
  // Totals
  const [totalA, setTotalA] = useState<number | null>(null);
  const [totalB, setTotalB] = useState<number | null>(null);
  const [totalC, setTotalC] = useState<number | null>(null);

  const handleInputChange = (freq: number, val: string) => {
    setInputs(prev => ({ ...prev, [freq]: val }));
  };

  useEffect(() => {
    let sumA = 0;
    let sumB = 0;
    let sumC = 0;
    let hasValues = false;

    FREQUENCIES.forEach(f => {
      const raw = inputs[f.freq];
      if (raw && raw.trim() !== '') {
        const val = parseFloat(raw);
        if (!isNaN(val)) {
          hasValues = true;
          // Calculate filtered values and convert back from log space for logarithmic addition
          sumA += Math.pow(10, (val + f.a) / 10);
          sumB += Math.pow(10, (val + f.b) / 10);
          sumC += Math.pow(10, (val + f.c) / 10);
        }
      }
    });

    if (hasValues) {
      setTotalA(10 * Math.log10(sumA));
      setTotalB(10 * Math.log10(sumB));
      setTotalC(10 * Math.log10(sumC));
    } else {
      setTotalA(null);
      setTotalB(null);
      setTotalC(null);
    }
  }, [inputs]);

  // Provide example values function
  const loadExample = () => {
    setInputs({
      62.5: '54',
      125: '60',
      250: '64',
      500: '53',
      1000: '48',
      2000: '43',
      4000: '39',
      8000: '32'
    });
  };

  const clearValues = () => {
    setInputs({});
  };

  return (
    <div className="max-w-4xl mx-auto border rounded-xl p-6 bg-card shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-2xl font-bold">A, B, C Decibel Weighting</h3>
        <div className="flex gap-2">
          <button onClick={loadExample} className="text-sm px-3 py-1 bg-muted rounded hover:bg-muted/80">Load Example</button>
          <button onClick={clearValues} className="text-sm px-3 py-1 bg-destructive/10 text-destructive rounded hover:bg-destructive/20">Clear</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Frequency (Hz)</th>
              <th className="px-4 py-3 w-48">Measured dB</th>
              <th className="px-4 py-3 text-right">Weighted dB(A)</th>
              <th className="px-4 py-3 text-right">Weighted dB(B)</th>
              <th className="px-4 py-3 text-right">Weighted dB(C)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {FREQUENCIES.map(f => {
              const raw = inputs[f.freq];
              const val = raw ? parseFloat(raw) : NaN;
              
              const valA = !isNaN(val) ? (val + f.a).toFixed(1) : '-';
              const valB = !isNaN(val) ? (val + f.b).toFixed(1) : '-';
              const valC = !isNaN(val) ? (val + f.c).toFixed(1) : '-';

              return (
                <tr key={f.freq} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{f.freq}</td>
                  <td className="px-4 py-2">
                    <Input 
                      type="number" 
                      value={inputs[f.freq] || ''} 
                      onChange={(e) => handleInputChange(f.freq, e.target.value)}
                      placeholder="dB"
                      className="h-8"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{valA}</td>
                  <td className="px-4 py-3 text-right font-mono">{valB}</td>
                  <td className="px-4 py-3 text-right font-mono">{valC}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-muted/50 font-bold border-t-2">
            <tr>
              <td colSpan={2} className="px-4 py-4 text-right">Total (Logarithmic Sum):</td>
              <td className="px-4 py-4 text-right text-lg text-primary">{totalA !== null ? totalA.toFixed(1) : '-'} <span className="text-xs font-normal text-muted-foreground">dB(A)</span></td>
              <td className="px-4 py-4 text-right text-lg text-primary">{totalB !== null ? totalB.toFixed(1) : '-'} <span className="text-xs font-normal text-muted-foreground">dB(B)</span></td>
              <td className="px-4 py-4 text-right text-lg text-primary">{totalC !== null ? totalC.toFixed(1) : '-'} <span className="text-xs font-normal text-muted-foreground">dB(C)</span></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p><strong>Note:</strong> Totals are calculated using exact logarithmic addition 10 × log₁₀( Σ 10^(Lᵢ / 10) ) rather than the manual estimation method.</p>
      </div>
    </div>
  );
}
