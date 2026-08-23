export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select';
  options?: { label: string; value: string | number }[];
  defaultValue: number | string;
  unit?: string;
}

export interface CalculatorOutput {
  id: string;
  label: string;
  formula: string; // Javascript string to be evaluated using new Function()
  unit?: string;
  format?: 'decimal' | 'currency' | 'scientific';
}

export interface CalculatorComponent {
  type: 'calculator';
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
}

export interface DataTableComponent {
  type: 'datatable';
  headers: string[];
  rows: (string | number)[][];
}

export interface ChartComponent {
  type: 'chart';
  options: any; // ECharts options object
}

export interface MarkdownComponent {
  type: 'markdown';
  content: string;
}

export type ToolComponent =
  | CalculatorComponent
  | DataTableComponent
  | ChartComponent
  | MarkdownComponent;

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  type: string; // e.g., 'calculator', 'datatable', 'calculator-table'
  components: ToolComponent[];
}
