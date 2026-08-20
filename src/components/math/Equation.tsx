import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface EquationProps {
  math: string;
  block?: boolean;
}

export const Equation: React.FC<EquationProps> = ({ math, block = false }) => {
  if (block) {
    return <BlockMath math={math} />;
  }
  return <InlineMath math={math} />;
};
