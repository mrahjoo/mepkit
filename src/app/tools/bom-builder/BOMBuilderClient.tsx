'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

interface BOMBuilderClientProps {
  catalog: { id: string, category: string, filename: string }[];
  pipeOptions: { label: string; filename: string }[];
}

export function BOMBuilderClient({ catalog, pipeOptions }: BOMBuilderClientProps) {
  const [bomItems, setBomItems] = useState<any[]>([]);
  
  // Pipe Add State
  const [selectedPipeFile, setSelectedPipeFile] = useState('');
  const [pipeData, setPipeData] = useState<any[]>([]);
  const [selectedPipeSize, setSelectedPipeSize] = useState('');
  const [pipeLength, setPipeLength] = useState<number | ''>(1);

  // Component Add State
  const [selectedCompCategory, setSelectedCompCategory] = useState('');
  const [selectedCompId, setSelectedCompId] = useState('');
  const [compData, setCompData] = useState<{headers: string[], rows: any[][]}>({headers: [], rows: []});
  const [selectedCompRowIdx, setSelectedCompRowIdx] = useState<number>(-1);
  const [compQuantity, setCompQuantity] = useState<number | ''>(1);

  const compCategories = Array.from(new Set(catalog.map(c => c.category))).sort();
  const availableComps = catalog.filter(c => c.category === selectedCompCategory);

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

  // Fetch component data
  useEffect(() => {
    if (!selectedCompId) return;
    fetch(`/data/pipedata/${selectedCompId}.json`)
      .then(res => res.json())
      .then(data => {
        setCompData(data);
        setSelectedCompRowIdx(-1);
      });
  }, [selectedCompId]);

  const addPipe = () => {
    const pipe = pipeData.find(p => p.size_imperial === selectedPipeSize);
    if (!pipe || typeof pipeLength !== 'number') return;
    
    setBomItems([
      ...bomItems, 
      {
        id: crypto.randomUUID(),
        type: 'Pipe',
        name: `${pipeOptions.find(o => o.filename === selectedPipeFile)?.label} - ${pipe.size_imperial}`,
        quantity: pipeLength,
        unit: 'm',
        unitWeight: pipe.weight || 0,
        totalWeight: (pipe.weight || 0) * pipeLength
      }
    ]);
  };

  const addComponent = () => {
    if (selectedCompRowIdx === -1 || typeof compQuantity !== 'number') return;
    
    const row = compData.rows[selectedCompRowIdx];
    // Try to find a weight column (Weight, Wt, Wgt, Wt.)
    let weightIdx = compData.headers.findIndex(h => h.toLowerCase().includes('weight') || h.toLowerCase() === 'wt' || h.toLowerCase() === 'wt.');
    
    let unitWeight = 0;
    if (weightIdx !== -1) {
      unitWeight = parseFloat(row[weightIdx]) || 0;
    }

    // Try to find a size column for the name (often first column)
    const sizeName = row[0] || '';

    setBomItems([
      ...bomItems,
      {
        id: crypto.randomUUID(),
        type: 'Component',
        name: `${selectedCompId} - ${sizeName}`,
        quantity: compQuantity,
        unit: 'pcs',
        unitWeight,
        totalWeight: unitWeight * compQuantity
      }
    ]);
  };

  const removeItem = (id: string) => {
    setBomItems(bomItems.filter(i => i.id !== id));
  };

  const totalWeight = bomItems.reduce((acc, item) => acc + item.totalWeight, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        
        <div className="p-4 border rounded-md bg-card space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Add Pipe</h3>
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
          <h3 className="font-semibold text-lg border-b pb-2">Add Component</h3>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <Select onValueChange={(val) => { setSelectedCompCategory(val as string); setSelectedCompId(''); }} value={selectedCompCategory}>
              <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
              <SelectContent>
                {compCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {availableComps.length > 0 && (
            <div>
              <label className="block text-sm mb-1">Component</label>
              <Select onValueChange={(val) => setSelectedCompId(val as string)} value={selectedCompId}>
                <SelectTrigger><SelectValue placeholder="Select component..." /></SelectTrigger>
                <SelectContent>
                  {availableComps.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {compData.rows.length > 0 && (
            <div>
              <label className="block text-sm mb-1">Size / Variant</label>
              <Select onValueChange={(val) => setSelectedCompRowIdx(parseInt(val as string))} value={selectedCompRowIdx.toString()}>
                <SelectTrigger><SelectValue placeholder="Select variant..." /></SelectTrigger>
                <SelectContent>
                  {compData.rows.map((row, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>{row[0]} {compData.headers[1] ? `- ${row[1]}` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1">Quantity (pcs)</label>
              <Input type="number" value={compQuantity} onChange={e => setCompQuantity(e.target.value === '' ? '' : parseInt(e.target.value))} />
            </div>
            <Button onClick={addComponent} disabled={selectedCompRowIdx === -1 || !compQuantity}><Plus className="h-4 w-4 mr-2"/> Add</Button>
          </div>
        </div>

      </div>

      <div className="lg:col-span-2">
        <div className="border rounded-md bg-card p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="font-semibold text-lg">Bill of Materials</h3>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-md font-semibold text-lg">
              Total Weight: {totalWeight.toFixed(2)} kg
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {bomItems.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                BOM is empty. Add items from the left.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name / Size</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Wt (kg)</TableHead>
                    <TableHead className="text-right">Total Wt (kg)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bomItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                      <TableCell className="text-right">{item.unitWeight.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">{item.totalWeight.toFixed(2)}</TableCell>
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
        </div>
      </div>
    </div>
  );
}
