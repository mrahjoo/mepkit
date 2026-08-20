'use client';

import React from 'react';
import { DataTableTemplate } from '../templates/DataTableTemplate';
import { ColumnDef } from '@tanstack/react-table';

export type PipeData = {
  material: string;
  schedule: string;
  roughness: number;
  size_id: number;
  size_metric: string;
  size_imperial: string;
  wall_thickness: number;
  outer_diameter: number;
  weight: number;
};

const columns: ColumnDef<PipeData, any>[] = [
  { accessorKey: 'size_metric', header: 'Nominal Size (Metric)' },
  { accessorKey: 'size_imperial', header: 'Nominal Size (Imperial)' },
  { accessorKey: 'wall_thickness', header: 'Wall Thickness (in)' },
  { accessorKey: 'outer_diameter', header: 'Outer Diameter (in)' },
  { accessorKey: 'weight', header: 'Weight (lbs/ft)' },
];

export const PipeTable: React.FC<{ data: PipeData[]; title: string; description: string }> = ({ data, title, description }) => {
  return <DataTableTemplate data={data} columns={columns} title={title} description={description} />;
};
