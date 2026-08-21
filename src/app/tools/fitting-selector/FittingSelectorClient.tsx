'use client';

import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FittingSelectorClientProps {
  fittings: any[];
  types: string[];
  sizes: string[];
}

export function FittingSelectorClient({ fittings, types, sizes }: FittingSelectorClientProps) {
  const [search, setSearch] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredFittings = useMemo(() => {
    return fittings.filter(f => {
      const matchSearch = f.description.toLowerCase().includes(search.toLowerCase());
      const matchSize = selectedSize === 'all' || f.size_imperial === selectedSize;
      const matchType = selectedType === 'all' || f.description.startsWith(selectedType);
      return matchSearch && matchSize && matchType;
    });
  }, [fittings, search, selectedSize, selectedType]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <Input 
            placeholder="Search descriptions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nominal Size</label>
          <Select onValueChange={(val) => setSelectedSize(val as string)} value={selectedSize}>
            <SelectTrigger>
              <SelectValue placeholder="All Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {sizes.map(size => (
                <SelectItem key={size} value={size as string}>
                  {size as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fitting Type</label>
          <Select onValueChange={(val) => setSelectedType(val as string)} value={selectedType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type as string} value={type as string}>
                  {type as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Size (Imperial)</TableHead>
              <TableHead>Size (Metric)</TableHead>
              <TableHead>K-Factor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFittings.slice(0, 100).map((f, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-sm">{f.code}</TableCell>
                <TableCell>{f.description}</TableCell>
                <TableCell>{f.size_imperial}</TableCell>
                <TableCell>{f.size_metric} mm</TableCell>
                <TableCell className="font-semibold">{f.k_factor.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredFittings.length > 100 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing 100 of {filteredFittings.length} results. Please refine your search.
        </p>
      )}
    </div>
  );
}
