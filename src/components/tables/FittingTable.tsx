'use client';

import React from 'react';
import { DataTableTemplate } from '../templates/DataTableTemplate';
import { ColumnDef } from '@tanstack/react-table';

export type FittingData = {
  size_mm: number;
  type_id: number;
  code: string;
  size_metric: string;
  size_imperial: string;
  description: string;
  k_factor: number;
};

const columns: ColumnDef<FittingData, any>[] = [
  { accessorKey: 'description', header: 'Fitting Description' },
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'size_metric', header: 'Size (Metric)' },
  { accessorKey: 'size_imperial', header: 'Size (Imperial)' },
  { accessorKey: 'k_factor', header: 'K-Factor' },
];

export const FittingTable: React.FC<{ data: FittingData[]; title: string; description: string }> = ({ data, title, description }) => {
  return <DataTableTemplate data={data} columns={columns} title={title} description={description} />;
};
