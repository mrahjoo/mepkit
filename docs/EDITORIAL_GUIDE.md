# MEPKit Editorial Guide

Welcome to the MEPKit Editorial Guide! This platform is built to make it easy for engineering experts to add new calculators, reference tables, and informational pages without needing deep coding knowledge.

## Content Management System (MDX)

We use **MDX** (Markdown + JSX) for our content. This allows you to write standard Markdown text while easily dropping in complex interactive React components (like Calculators, Tables, and Math Equations).

### Adding a New Page

Pages are located in the `src/app/` directory (for static structural pages) or within dedicated content folders if MDX routing is fully set up.

1. **Create an `.mdx` file** for your content (e.g., `src/app/calculators/pipe-friction/page.mdx`).
2. **Write standard Markdown** for headings, paragraphs, and lists.

### Using Engineering Components

You can use the following specialized components inside your MDX files:

#### Math Equations

To render professional engineering equations (using KaTeX):

```mdx
import { Equation } from '@/components/math/Equation';

Here is the Darcy-Weisbach equation:
<Equation block math="\Delta P = f \cdot \frac{L}{D} \cdot \frac{\rho V^2}{2}" />
```

#### Calculators

To embed a new calculator, developers will first create the logic in `src/components/calculators/`. You can then import and use it in your MDX:

```mdx
import { CalculatorTemplate } from '@/components/templates/CalculatorTemplate';
import { PipeFrictionCalc } from '@/components/calculators/PipeFrictionCalc';

<CalculatorTemplate 
  title="Pipe Friction Calculator" 
  description="Calculate pressure drop in pipes using the Darcy-Weisbach equation."
>
  <PipeFrictionCalc />
</CalculatorTemplate>
```

#### Data Tables

Similar to calculators, developers will provide a data table component that you can wrap in the `DataTableTemplate`.

### SEO and Ads

- **SEO:** Always ensure your page has a clear `title` and `description`.
- **Ads:** The templates (`CalculatorTemplate`, `DataTableTemplate`) automatically reserve space for Google AdSense placements to ensure a consistent revenue stream without cluttering the engineering data.
