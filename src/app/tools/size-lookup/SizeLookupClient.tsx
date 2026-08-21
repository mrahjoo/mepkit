'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SizeLookupClientProps {
  options: { label: string; filename: string }[];
}

export function SizeLookupClient({ options }: SizeLookupClientProps) {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [pipeData, setPipeData] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile) return;
    
    setLoading(true);
    fetch(`/data/pipes/${selectedFile}`)
      .then(res => res.json())
      .then(data => {
        setPipeData(data);
        setSelectedSize('');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedFile]);

  const activeRow = pipeData.find(row => row.size_imperial === selectedSize);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">1. Select Material & Schedule</label>
          <Select onValueChange={(val) => setSelectedFile(val as string)} value={selectedFile}>
            <SelectTrigger>
              <SelectValue placeholder="Select a pipe specification..." />
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

        {pipeData.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">2. Select Nominal Size</label>
            <Select onValueChange={(val) => setSelectedSize(val as string)} value={selectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Select nominal size..." />
              </SelectTrigger>
              <SelectContent>
                {pipeData.map(row => (
                  <SelectItem key={row.size_id} value={row.size_imperial}>
                    {row.size_imperial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Pipe Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : !selectedFile ? (
              <p className="text-muted-foreground">Please select a material to begin.</p>
            ) : !selectedSize ? (
              <p className="text-muted-foreground">Please select a nominal size.</p>
            ) : activeRow ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Outer Diameter (mm)</span>
                  <span className="font-semibold">{activeRow.outer_diameter}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Wall Thickness (mm)</span>
                  <span className="font-semibold">{activeRow.wall_thickness}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Inner Diameter (mm)</span>
                  <span className="font-semibold">
                    {Math.max(0, activeRow.outer_diameter - 2 * activeRow.wall_thickness).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Weight (kg/m)</span>
                  <span className="font-semibold">{activeRow.weight}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Roughness (mm)</span>
                  <span className="font-semibold">{activeRow.roughness}</span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
