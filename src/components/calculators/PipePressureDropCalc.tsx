'use client';

import React, { useState } from 'react';

export const PipePressureDropCalc = () => {
  const [length, setLength] = useState<number>(100);
  const [flowRate, setFlowRate] = useState<number>(10); // L/s
  const [density, setDensity] = useState<number>(998); // kg/m3 (water)
  const [diameter, setDiameter] = useState<number>(50); // mm

  // Simplified Darcy-Weisbach calculation (using a fixed friction factor for demo)
  // v = Q / A
  // A = pi * r^2
  const calculatePressureDrop = () => {
    const f = 0.02; // assumed friction factor
    
    // convert flow rate from L/s to m3/s
    const Q = flowRate / 1000;
    
    // convert diameter to m
    const D = diameter / 1000;
    
    // Area in m2
    const A = Math.PI * Math.pow(D / 2, 2);
    
    // Velocity in m/s
    const v = Q / A;
    
    // delta P in Pascals
    // dP = f * (L/D) * (rho * v^2 / 2)
    const dP = f * (length / D) * (density * Math.pow(v, 2) / 2);
    
    // convert to kPa
    return (dP / 1000).toFixed(2);
  };

  return (
    <div className="border rounded-xl p-6 bg-card max-w-2xl mx-auto shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Pipe Pressure Drop Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Pipe Length (m)</label>
          <input 
            type="number" 
            value={length} 
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Internal Diameter (mm)</label>
          <input 
            type="number" 
            value={diameter} 
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Flow Rate (L/s)</label>
          <input 
            type="number" 
            value={flowRate} 
            onChange={(e) => setFlowRate(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Fluid Density (kg/m³)</label>
          <input 
            type="number" 
            value={density} 
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="p-6 bg-primary/10 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Estimated Pressure Drop</h3>
        <p className="text-4xl font-bold text-primary">{calculatePressureDrop()} kPa</p>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        * This is a simplified calculation using a fixed friction factor (f=0.02). 
        In production, this will look up actual pipe roughness and compute Reynolds numbers.
      </p>
    </div>
  );
};
