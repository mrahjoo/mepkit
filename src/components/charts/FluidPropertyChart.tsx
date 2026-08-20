'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FluidData } from '../tables/FluidTable';

interface FluidPropertyChartProps {
  data: FluidData[];
  fluidName: string;
}

export const FluidPropertyChart: React.FC<FluidPropertyChartProps> = ({ data, fluidName }) => {
  // Extract data series
  const tempC = data.map(d => Number((d.temperature_k - 273.15).toFixed(2)));
  const density = data.map(d => d.density);
  const viscosity = data.map(d => d.viscosity_cp);

  const option = {
    title: {
      text: `${fluidName} Properties vs. Temperature`,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['Density (kg/m³)', 'Viscosity (cP)'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: 'Temperature (°C)',
      nameLocation: 'middle',
      nameGap: 30,
      boundaryGap: false,
      data: tempC
    },
    yAxis: [
      {
        type: 'value',
        name: 'Density\n(kg/m³)',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6'
          }
        },
      },
      {
        type: 'value',
        name: 'Viscosity\n(cP)',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#91CC75'
          }
        },
      }
    ],
    series: [
      {
        name: 'Density (kg/m³)',
        type: 'line',
        yAxisIndex: 0,
        data: density,
        smooth: true,
        lineStyle: { width: 3 }
      },
      {
        name: 'Viscosity (cP)',
        type: 'line',
        yAxisIndex: 1,
        data: viscosity,
        smooth: true,
        lineStyle: { width: 3 }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};
