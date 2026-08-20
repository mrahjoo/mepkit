'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DecibelCalc() {
  // Panel 1: Calculate dB
  const [p1Mode, setP1Mode] = useState<'power' | 'amplitude'>('power');
  const [p1Signal, setP1Signal] = useState<string>('1');
  const [p1Ref, setP1Ref] = useState<string>('1e-12');
  const [p1Db, setP1Db] = useState<string>('');

  // Panel 2: Calculate Signal
  const [p2Mode, setP2Mode] = useState<'power' | 'amplitude'>('power');
  const [p2Db, setP2Db] = useState<string>('120');
  const [p2Ref, setP2Ref] = useState<string>('1e-12');
  const [p2Signal, setP2Signal] = useState<string>('');

  // Calculate dB
  useEffect(() => {
    if (p1Signal === '' || p1Ref === '') {
      setP1Db('');
      return;
    }
    const s = parseFloat(p1Signal);
    const sRef = parseFloat(p1Ref);
    
    if (!isNaN(s) && !isNaN(sRef) && sRef !== 0 && s > 0 && sRef > 0) {
      const ratio = s / sRef;
      const multiplier = p1Mode === 'power' ? 10 : 20;
      const db = multiplier * Math.log10(ratio);
      setP1Db(db.toFixed(2));
    } else {
      setP1Db('');
    }
  }, [p1Signal, p1Ref, p1Mode]);

  // Calculate Signal
  useEffect(() => {
    if (p2Db === '' || p2Ref === '') {
      setP2Signal('');
      return;
    }
    const l = parseFloat(p2Db);
    const sRef = parseFloat(p2Ref);
    
    if (!isNaN(l) && !isNaN(sRef)) {
      const multiplier = p2Mode === 'power' ? 10 : 20;
      const exponent = l / multiplier;
      const s = sRef * Math.pow(10, exponent);
      setP2Signal(s.toExponential(4));
    } else {
      setP2Signal('');
    }
  }, [p2Db, p2Ref, p2Mode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Panel 1: Calculate dB */}
      <div className="border rounded-xl p-6 bg-card shadow-sm">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Calculate Decibels (dB)</h3>
        
        <div className="space-y-6">
          <div className="flex gap-4 mb-4">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${p1Mode === 'power' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setP1Mode('power')}
            >
              Power Ratio (10 log)
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${p1Mode === 'amplitude' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setP1Mode('amplitude')}
            >
              Amplitude Ratio (20 log)
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p1-signal">Signal Level (S or A)</Label>
            <Input 
              id="p1-signal" 
              type="number" 
              value={p1Signal} 
              onChange={(e) => setP1Signal(e.target.value)} 
              placeholder="e.g. 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p1-ref">Reference Level (S_ref or A_ref)</Label>
            <Input 
              id="p1-ref" 
              type="text" 
              value={p1Ref} 
              onChange={(e) => setP1Ref(e.target.value)} 
              placeholder="e.g. 1e-12"
            />
            <p className="text-xs text-muted-foreground">Standard sound power ref is 1e-12 W</p>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label className="text-muted-foreground">Decibel Level (L)</Label>
            <div className="text-4xl font-bold text-primary">
              {p1Db ? `${p1Db} dB` : '-- dB'}
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: L = {p1Mode === 'power' ? '10' : '20'} × log₁₀(S / S_ref)
            </p>
          </div>
        </div>
      </div>

      {/* Panel 2: Calculate Signal */}
      <div className="border rounded-xl p-6 bg-card shadow-sm">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Calculate Signal Level</h3>
        
        <div className="space-y-6">
          <div className="flex gap-4 mb-4">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${p2Mode === 'power' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setP2Mode('power')}
            >
              Power Ratio (10 log)
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${p2Mode === 'amplitude' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              onClick={() => setP2Mode('amplitude')}
            >
              Amplitude Ratio (20 log)
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p2-db">Decibel Level (L)</Label>
            <Input 
              id="p2-db" 
              type="number" 
              value={p2Db} 
              onChange={(e) => setP2Db(e.target.value)} 
              placeholder="e.g. 120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p2-ref">Reference Level (S_ref or A_ref)</Label>
            <Input 
              id="p2-ref" 
              type="text" 
              value={p2Ref} 
              onChange={(e) => setP2Ref(e.target.value)} 
              placeholder="e.g. 1e-12"
            />
          </div>
          
          <div className="space-y-2 pt-4">
            <Label className="text-muted-foreground">Absolute Signal Level (S or A)</Label>
            <div className="text-4xl font-bold text-primary">
              {p2Signal ? `${p2Signal}` : '-- '}
            </div>
            <p className="text-xs text-muted-foreground">
              Formula: S = S_ref × 10^(L / {p2Mode === 'power' ? '10' : '20'})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
