'use client';

import React from 'react';
import { DataTableTemplate } from '../templates/DataTableTemplate';
import { ColumnDef } from '@tanstack/react-table';

export type FluidData = {
  name: string;
  formula: string;
  temperature_k: number;
  pressure_kpa: number;
  density: number;
  viscosity_cp: number;
  vapor_pressure_kpa: number;
};

const columns: ColumnDef<FluidData, any>[] = [
  { 
    accessorKey: 'temperature_k', 
    header: 'Temperature (K)',
    cell: (info) => info.getValue()?.toFixed(2)
  },
  { 
    accessorKey: 'temperature_k', 
    id: 'temperature_c',
    header: 'Temperature (°C)',
    cell: (info) => (info.getValue() as number - 273.15).toFixed(2)
  },
  { accessorKey: 'density', header: 'Density (kg/m³)' },
  { accessorKey: 'viscosity_cp', header: 'Dynamic Viscosity (cP)' },
  { accessorKey: 'vapor_pressure_kpa', header: 'Vapor Pressure (kPa)' },
];

export const FluidTable: React.FC<{ data: FluidData[]; title: string; description: string }> = ({ data, title, description }) => {
  return <DataTableTemplate data={data} columns={columns} title={title} description={description} />;
};
