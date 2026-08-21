'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface FluidPropertiesClientProps {
  options: { label: string; filename: string }[];
}

function interpolate(x: number, x0: number, x1: number, y0: number, y1: number) {
  if (x0 === x1) return y0;
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

export function FluidPropertiesClient({ options }: FluidPropertiesClientProps) {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fluidData, setFluidData] = useState<any[]>([]);
  const [temperature, setTemperature] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile) return;
    
    setLoading(true);
    fetch(`/data/fluids/${selectedFile}`)
      .then(res => res.json())
      .then(data => {
        // Sort by temperature for reliable interpolation
        const sorted = data.sort((a: any, b: any) => a.temperature_k - b.temperature_k);
        setFluidData(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedFile]);

  const properties = useMemo(() => {
    if (typeof temperature !== 'number' || fluidData.length === 0) return null;
    
    const tempK = temperature + 273.15; // Assuming input is Celsius, convert to Kelvin
    
    // Find bounding points
    let p0 = fluidData[0];
    let p1 = fluidData[fluidData.length - 1];
    
    if (tempK <= p0.temperature_k) {
      return p0; // Extrapolate lower bound (or just return min)
    }
    if (tempK >= p1.temperature_k) {
      return p1; // Extrapolate upper bound (or just return max)
    }
    
    for (let i = 0; i < fluidData.length - 1; i++) {
      if (fluidData[i].temperature_k <= tempK && fluidData[i+1].temperature_k >= tempK) {
        p0 = fluidData[i];
        p1 = fluidData[i+1];
        break;
      }
    }
    
    return {
      temperature_k: tempK,
      density: interpolate(tempK, p0.temperature_k, p1.temperature_k, p0.density, p1.density),
      viscosity_cp: interpolate(tempK, p0.temperature_k, p1.temperature_k, p0.viscosity_cp, p1.viscosity_cp),
      vapor_pressure_kpa: interpolate(tempK, p0.temperature_k, p1.temperature_k, p0.vapor_pressure_kpa, p1.vapor_pressure_kpa)
    };
  }, [temperature, fluidData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">1. Select Fluid</label>
          <Select onValueChange={(val) => setSelectedFile(val as string)} value={selectedFile}>
            <SelectTrigger>
              <SelectValue placeholder="Select a fluid..." />
            </SelectTrigger>
            <SelectContent>
              {options.map(opt => (
                <SelectItem key={opt.filename} value={opt.filename}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {fluidData.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">2. Enter Temperature (°C)</label>
            <Input 
              type="number" 
              placeholder="e.g. 25"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </div>
        )}
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Interpolated Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : !selectedFile ? (
              <p className="text-muted-foreground">Please select a fluid to begin.</p>
            ) : typeof temperature !== 'number' ? (
              <p className="text-muted-foreground">Please enter a valid temperature.</p>
            ) : properties ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Temperature (K)</span>
                  <span className="font-semibold">{properties.temperature_k.toFixed(2)} K</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Density</span>
                  <span className="font-semibold">{properties.density.toFixed(4)} kg/m³</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Viscosity</span>
                  <span className="font-semibold">{properties.viscosity_cp.toFixed(4)} cP</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Vapor Pressure</span>
                  <span className="font-semibold">{properties.vapor_pressure_kpa.toFixed(2)} kPa</span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
