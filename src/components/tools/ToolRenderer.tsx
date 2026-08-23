'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ReactECharts from 'echarts-for-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ToolConfig, ToolComponent, CalculatorComponent, DataTableComponent, ChartComponent, MarkdownComponent } from '@/lib/tool-schema';

interface ToolRendererProps {
  config: ToolConfig;
}

export function ToolRenderer({ config }: ToolRendererProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{config.title}</h1>
        <p className="text-lg text-muted-foreground">{config.description}</p>
      </div>
      
      {config.components.map((comp, index) => {
        switch (comp.type) {
          case 'calculator':
            return <CalculatorView key={index} comp={comp} />;
          case 'datatable':
            return <DataTableView key={index} comp={comp} />;
          case 'chart':
            return <ChartView key={index} comp={comp} />;
          case 'markdown':
            return <MarkdownView key={index} comp={comp} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function CalculatorView({ comp }: { comp: CalculatorComponent }) {
  // Initialize state with default values
  const [inputs, setInputs] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {};
    comp.inputs.forEach(input => {
      initial[input.id] = input.defaultValue;
    });
    return initial;
  });

  const [outputs, setOutputs] = useState<Record<string, number | string | null>>({});

  useEffect(() => {
    const newOutputs: Record<string, number | string | null> = {};
    
    comp.outputs.forEach(output => {
      try {
        // Safe evaluation of the formula using the inputs object
        const func = new Function('inputs', `return ${output.formula}`);
        const result = func(inputs);
        
        if (typeof result === 'number' && !isNaN(result)) {
          // Format based on config
          if (output.format === 'decimal') {
            newOutputs[output.id] = result.toFixed(2);
          } else if (output.format === 'currency') {
            newOutputs[output.id] = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result);
          } else {
            newOutputs[output.id] = result;
          }
        } else {
          newOutputs[output.id] = result;
        }
      } catch (err) {
        console.error(`Error evaluating formula for ${output.id}:`, err);
        newOutputs[output.id] = 'Error';
      }
    });
    
    setOutputs(newOutputs);
  }, [inputs, comp.outputs]);

  const handleInputChange = (id: string, value: string, type: 'number' | 'select') => {
    setInputs(prev => ({
      ...prev,
      [id]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inputs</h3>
            {comp.inputs.map(input => (
              <div key={input.id} className="space-y-2">
                <Label htmlFor={input.id}>{input.label} {input.unit && `(${input.unit})`}</Label>
                {input.type === 'select' && input.options ? (
                  <Select 
                    value={String(inputs[input.id] ?? '')} 
                    onValueChange={(val) => handleInputChange(input.id, val, 'select')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {input.options.map(opt => (
                        <SelectItem key={String(opt.value)} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    id={input.id}
                    type="number"
                    value={inputs[input.id] ?? ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value, 'number')}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Results</h3>
            <div className="bg-muted p-4 rounded-lg space-y-4">
              {comp.outputs.map(output => (
                <div key={output.id} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">{output.label}</span>
                  <span className="text-xl font-bold">
                    {outputs[output.id] !== undefined ? outputs[output.id] : '--'} {output.unit && <span className="text-sm font-normal text-muted-foreground">{output.unit}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DataTableView({ comp }: { comp: DataTableComponent }) {
  return (
    <Card className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {comp.headers.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comp.rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function ChartView({ comp }: { comp: ChartComponent }) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <ReactECharts option={comp.options} style={{ height: '400px', width: '100%' }} />
      </CardContent>
    </Card>
  );
}

function MarkdownView({ comp }: { comp: MarkdownComponent }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
      >
        {comp.content}
      </ReactMarkdown>
    </div>
  );
}
