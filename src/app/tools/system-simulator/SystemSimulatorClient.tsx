'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface SystemSimulatorClientProps {
  pipeOptions: { label: string; filename: string }[];
  fluidOptions: { label: string; filename: string }[];
  fittings: any[];
  fittingTypes: string[];
  fittingSizes: string[];
}

function interpolate(x: number, x0: number, x1: number, y0: number, y1: number) {
  if (x0 === x1) return y0;
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

export function SystemSimulatorClient({ pipeOptions, fluidOptions, fittings, fittingTypes, fittingSizes }: SystemSimulatorClientProps) {
  const [networkItems, setNetworkItems] = useState<any[]>([]);
  
  // Fluid Config
  const [selectedFluidFile, setSelectedFluidFile] = useState<string>('');
  const [fluidData, setFluidData] = useState<any[]>([]);
  const [temperature, setTemperature] = useState<number | ''>(20);
  const [flowRate, setFlowRate] = useState<number | ''>(0.01); // m3/s

  // Add Pipe Config
  const [selectedPipeFile, setSelectedPipeFile] = useState('');
  const [pipeData, setPipeData] = useState<any[]>([]);
  const [selectedPipeSize, setSelectedPipeSize] = useState('');
  const [pipeLength, setPipeLength] = useState<number | ''>(10);

  // Add Fitting Config
  const [selectedFittingType, setSelectedFittingType] = useState('all');
  const [selectedFittingSize, setSelectedFittingSize] = useState('all');
  const [selectedFittingCode, setSelectedFittingCode] = useState('');

  // Fetch pipe data
  useEffect(() => {
    if (!selectedPipeFile) return;
    fetch(`/data/pipes/${selectedPipeFile}`)
      .then(res => res.json())
      .then(data => {
        setPipeData(data);
        setSelectedPipeSize('');
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

  // Fluid Properties Memo
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
      viscosity_pas: interpolate(tempK, p0.temperature_k, p1.temperature_k, p0.viscosity_cp, p1.viscosity_cp) / 1000
    };
  }, [temperature, fluidData]);

  const addPipe = () => {
    const pipe = pipeData.find(p => p.size_imperial === selectedPipeSize);
    if (!pipe || typeof pipeLength !== 'number') return;
    
    setNetworkItems([
      ...networkItems, 
      {
        id: crypto.randomUUID(),
        type: 'pipe',
        name: `${pipeOptions.find(o => o.filename === selectedPipeFile)?.label} - ${pipe.size_imperial}`,
        length: pipeLength,
        id_m: Math.max(0, pipe.outer_diameter - 2 * pipe.wall_thickness) / 1000,
        roughness_m: pipe.roughness / 1000,
      }
    ]);
  };

  const addFitting = () => {
    const fitting = fittings.find(f => f.code === selectedFittingCode);
    if (!fitting) return;
    
    // We assume the ID of the fitting matches the nearest pipe they have added, or we just prompt for it.
    // For simplicity, a fitting adds a K-factor loss: dP = K * (rho * v^2 / 2)
    // But v requires ID. We'll require the user to pick an ID for the fitting.
    // To simplify the UI, we'll ask them to associate it with the last added pipe's ID.
    const lastPipe = [...networkItems].reverse().find(i => i.type === 'pipe');
    const assumed_id_m = lastPipe ? lastPipe.id_m : 0.05; // default 50mm if none

    setNetworkItems([
      ...networkItems,
      {
        id: crypto.randomUUID(),
        type: 'fitting',
        name: fitting.description,
        k_factor: fitting.k_factor,
        assumed_id_m
      }
    ]);
  };

  const removeItem = (id: string) => {
    setNetworkItems(networkItems.filter(i => i.id !== id));
  };

  // Computation
  const simulationResults = useMemo(() => {
    if (!fluidProps || typeof flowRate !== 'number' || networkItems.length === 0) return null;

    let totalPressureDropKPa = 0;
    const computedItems = networkItems.map(item => {
      let dP_kPa = 0;
      
      const id_m = item.type === 'pipe' ? item.id_m : item.assumed_id_m;
      if (id_m <= 0) return { ...item, dP_kPa: 0, error: 'Invalid ID' };
      
      const area = Math.PI * Math.pow(id_m / 2, 2);
      const velocity = flowRate / area;
      const velocityHead = (fluidProps.density * Math.pow(velocity, 2)) / 2; // Pa
      const reynolds = (fluidProps.density * velocity * id_m) / fluidProps.viscosity_pas;

      if (item.type === 'pipe') {
        let frictionFactor = 0;
        if (reynolds < 2300) {
          frictionFactor = 64 / reynolds;
        } else {
          const term1 = item.roughness_m / (3.7 * id_m);
          const term2 = 5.74 / Math.pow(reynolds, 0.9);
          frictionFactor = 0.25 / Math.pow(Math.log10(term1 + term2), 2);
        }
        const pressureDropPa = frictionFactor * (item.length / id_m) * velocityHead;
        dP_kPa = pressureDropPa / 1000;
      } else if (item.type === 'fitting') {
        const pressureDropPa = item.k_factor * velocityHead;
        dP_kPa = pressureDropPa / 1000;
      }

      totalPressureDropKPa += dP_kPa;
      return { ...item, dP_kPa, velocity, reynolds };
    });

    return { totalPressureDropKPa, computedItems };
  }, [networkItems, fluidProps, flowRate]);


  const availableFittings = useMemo(() => {
    return fittings.filter(f => {
      const matchSize = selectedFittingSize === 'all' || f.size_imperial === selectedFittingSize;
      const matchType = selectedFittingType === 'all' || f.description.startsWith(selectedFittingType);
      return matchSize && matchType;
    });
  }, [fittings, selectedFittingSize, selectedFittingType]);


  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Global Fluid Settings</h3>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Temp (°C)</label>
              <Input type="number" value={temperature} onChange={e => setTemperature(e.target.value === '' ? '' : parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Flow Rate (m³/s)</label>
              <Input type="number" step="0.001" value={flowRate} onChange={e => setFlowRate(e.target.value === '' ? '' : parseFloat(e.target.value))} />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Add Pipe Segment</h3>
          <div>
            <label className="block text-sm mb-1">Material & Schedule</label>
            <Select onValueChange={(val) => setSelectedPipeFile(val as string)} value={selectedPipeFile}>
              <SelectTrigger><SelectValue placeholder="Select pipe..." /></SelectTrigger>
              <SelectContent>
                {pipeOptions.map(opt => (
                  <SelectItem key={opt.filename} value={opt.filename}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {pipeData.length > 0 && (
            <div>
              <label className="block text-sm mb-1">Size</label>
              <Select onValueChange={(val) => setSelectedPipeSize(val as string)} value={selectedPipeSize}>
                <SelectTrigger><SelectValue placeholder="Select size..." /></SelectTrigger>
                <SelectContent>
                  {pipeData.map(row => (
                    <SelectItem key={row.size_id} value={row.size_imperial}>{row.size_imperial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1">Length (m)</label>
              <Input type="number" value={pipeLength} onChange={e => setPipeLength(e.target.value === '' ? '' : parseFloat(e.target.value))} />
            </div>
            <Button onClick={addPipe} disabled={!selectedPipeSize || !pipeLength}><Plus className="h-4 w-4 mr-2"/> Add</Button>
          </div>
        </div>

        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Add Fitting</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Size Filter</label>
              <Select onValueChange={(val) => setSelectedFittingSize(val as string)} value={selectedFittingSize}>
                <SelectTrigger><SelectValue placeholder="All Sizes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {fittingSizes.map(size => (
                    <SelectItem key={size} value={size as string}>{size as string}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Type Filter</label>
              <Select onValueChange={(val) => setSelectedFittingType(val as string)} value={selectedFittingType}>
                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {fittingTypes.map(type => (
                    <SelectItem key={type as string} value={type as string}>{type as string}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Fitting</label>
            <Select onValueChange={(val) => setSelectedFittingCode(val as string)} value={selectedFittingCode}>
              <SelectTrigger><SelectValue placeholder="Select fitting..." /></SelectTrigger>
              <SelectContent>
                {availableFittings.slice(0, 50).map(f => (
                  <SelectItem key={f.code} value={f.code}>{f.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addFitting} disabled={!selectedFittingCode} className="w-full"><Plus className="h-4 w-4 mr-2"/> Add</Button>
          <p className="text-xs text-muted-foreground mt-2">
            *Fittings use the internal diameter of the most recently added pipe segment for velocity computation.
          </p>
        </div>
      </div>

      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader className="bg-primary text-primary-foreground rounded-t-xl py-4">
            <CardTitle className="flex justify-between items-center">
              <span>Network Assembly</span>
              {simulationResults && (
                <span className="text-2xl">{simulationResults.totalPressureDropKPa.toFixed(3)} kPa Total</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[700px]">
              {networkItems.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Your network is empty. Add pipes and fittings to begin simulation.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Parameters</TableHead>
                      <TableHead className="text-right font-bold text-primary">ΔP (kPa)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulationResults?.computedItems.map((item, idx) => (
                      <TableRow key={item.id}>
                        <TableCell className="capitalize font-semibold">{item.type}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.type === 'pipe' ? (
                            <span>L: {item.length}m | ID: {(item.id_m * 1000).toFixed(1)}mm</span>
                          ) : (
                            <span>K: {item.k_factor.toFixed(2)} | Assumed ID: {(item.assumed_id_m * 1000).toFixed(1)}mm</span>
                          )}
                          <br />
                          {item.velocity && (
                            <span className="text-xs">v: {item.velocity.toFixed(2)} m/s | Re: {Math.round(item.reynolds).toLocaleString()}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {item.dP_kPa !== undefined ? item.dP_kPa.toFixed(3) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
