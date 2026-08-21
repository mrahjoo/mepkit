'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PressureDropClientProps {
  pipeOptions: { label: string; filename: string }[];
  fluidOptions: { label: string; filename: string }[];
}

function interpolate(x: number, x0: number, x1: number, y0: number, y1: number) {
  if (x0 === x1) return y0;
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

export function PressureDropClient({ pipeOptions, fluidOptions }: PressureDropClientProps) {
  const [selectedPipeFile, setSelectedPipeFile] = useState<string>('');
  const [pipeData, setPipeData] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const [selectedFluidFile, setSelectedFluidFile] = useState<string>('');
  const [fluidData, setFluidData] = useState<any[]>([]);
  
  const [temperature, setTemperature] = useState<number | ''>(20);
  const [flowRate, setFlowRate] = useState<number | ''>(0.01); // m3/s
  const [length, setLength] = useState<number | ''>(100); // meters

  // Fetch pipe data
  useEffect(() => {
    if (!selectedPipeFile) return;
    fetch(`/data/pipes/${selectedPipeFile}`)
      .then(res => res.json())
      .then(data => {
        setPipeData(data);
        setSelectedSize('');
      });
  }, [selectedPipeFile]);

  // Fetch fluid data
  useEffect(() => {
    if (!selectedFluidFile) return;
    fetch(`/data/fluids/${selectedFluidFile}`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.temperature_k - b.temperature_k);
        setFluidData(sorted);
      });
  }, [selectedFluidFile]);

  const activePipe = pipeData.find(row => row.size_imperial === selectedSize);

  const fluidProps = useMemo(() => {
    if (typeof temperature !== 'number' || fluidData.length === 0) return null;
    const tempK = temperature + 273.15;
    
    let p0 = fluidData[0];
    let p1 = fluidData[fluidData.length - 1];
    
    if (tempK <= p0.temperature_k) return p0;
    if (tempK >= p1.temperature_k) return p1;
    
    for (let i = 0; i < fluidData.length - 1; i++) {
      if (fluidData[i].temperature_k <= tempK && fluidData[i+1].temperature_k >= tempK) {
        p0 = fluidData[i];
        p1 = fluidData[i+1];
        break;
      }
    }
    
    return {
      density: interpolate(tempK, p0.temperature_k, p1.temperature_k, p0.density, p1.density),
      // Viscosity is in cP (mPa.s). Convert to Pa.s (kg/m.s)
      viscosity_pas: interpolate(tempK, p0.temperature_k, p1.temperature_k, p0.viscosity_cp, p1.viscosity_cp) / 1000
    };
  }, [temperature, fluidData]);

  const results = useMemo(() => {
    if (!activePipe || !fluidProps || typeof flowRate !== 'number' || typeof length !== 'number') return null;
    
    const id_mm = Math.max(0, activePipe.outer_diameter - 2 * activePipe.wall_thickness);
    if (id_mm <= 0) return null;
    
    const id_m = id_mm / 1000;
    const roughness_m = activePipe.roughness / 1000;
    
    const area = Math.PI * Math.pow(id_m / 2, 2);
    const velocity = flowRate / area; // m/s
    
    const reynolds = (fluidProps.density * velocity * id_m) / fluidProps.viscosity_pas;
    
    let frictionFactor = 0;
    if (reynolds < 2300) {
      // Laminar
      frictionFactor = 64 / reynolds;
    } else {
      // Turbulent (Swamee-Jain equation)
      const term1 = roughness_m / (3.7 * id_m);
      const term2 = 5.74 / Math.pow(reynolds, 0.9);
      frictionFactor = 0.25 / Math.pow(Math.log10(term1 + term2), 2);
    }
    
    // Darcy-Weisbach Equation: dP = f * (L/D) * (rho * v^2 / 2)
    const pressureDropPa = frictionFactor * (length / id_m) * (fluidProps.density * Math.pow(velocity, 2) / 2);
    const pressureDropKPa = pressureDropPa / 1000;
    
    return {
      velocity,
      reynolds,
      frictionFactor,
      pressureDropKPa
    };
  }, [activePipe, fluidProps, flowRate, length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">1. Pipe Configuration</h3>
          <div>
            <label className="block text-sm mb-1">Material & Schedule</label>
            <Select onValueChange={(val) => setSelectedPipeFile(val as string)} value={selectedPipeFile}>
              <SelectTrigger><SelectValue placeholder="Select a pipe..." /></SelectTrigger>
              <SelectContent>
                {pipeOptions.map(opt => (
                  <SelectItem key={opt.filename} value={opt.filename}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {pipeData.length > 0 && (
            <div>
              <label className="block text-sm mb-1">Nominal Size</label>
              <Select onValueChange={(val) => setSelectedSize(val as string)} value={selectedSize}>
                <SelectTrigger><SelectValue placeholder="Select size..." /></SelectTrigger>
                <SelectContent>
                  {pipeData.map(row => (
                    <SelectItem key={row.size_id} value={row.size_imperial}>{row.size_imperial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {activePipe && (
            <div className="text-sm text-muted-foreground pt-2">
              ID: {(activePipe.outer_diameter - 2 * activePipe.wall_thickness).toFixed(2)} mm | Roughness: {activePipe.roughness} mm
            </div>
          )}
        </div>

        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">2. Fluid Configuration</h3>
          <div>
            <label className="block text-sm mb-1">Fluid</label>
            <Select onValueChange={(val) => setSelectedFluidFile(val as string)} value={selectedFluidFile}>
              <SelectTrigger><SelectValue placeholder="Select fluid..." /></SelectTrigger>
              <SelectContent>
                {fluidOptions.map(opt => (
                  <SelectItem key={opt.filename} value={opt.filename}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-1">Temperature (°C)</label>
            <Input 
              type="number" 
              value={temperature}
              onChange={(e) => setTemperature(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">3. System Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Flow Rate (m³/s)</label>
              <Input 
                type="number" 
                value={flowRate}
                step="0.001"
                onChange={(e) => setFlowRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Pipe Length (m)</label>
              <Input 
                type="number" 
                value={length}
                onChange={(e) => setLength(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Card className="sticky top-6">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!results ? (
              <p className="text-muted-foreground text-center py-10">Complete all configuration steps to see results.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center p-4 bg-muted rounded-md text-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Pressure Drop</span>
                  <span className="text-4xl font-bold text-primary">{results.pressureDropKPa.toFixed(2)} <span className="text-xl font-normal">kPa</span></span>
                  <span className="text-sm mt-1">({(results.pressureDropKPa / 100).toFixed(4)} bar)</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Velocity</span>
                    <span className="font-semibold">{results.velocity.toFixed(2)} m/s</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Reynolds Number</span>
                    <span className="font-semibold">{Math.round(results.reynolds).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Flow Regime</span>
                    <span className="font-semibold">
                      {results.reynolds < 2300 ? 'Laminar' : results.reynolds > 4000 ? 'Turbulent' : 'Transitional'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Friction Factor (f)</span>
                    <span className="font-semibold">{results.frictionFactor.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
