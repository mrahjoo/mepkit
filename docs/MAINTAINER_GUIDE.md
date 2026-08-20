# MEPKit Maintainer Guide

This document outlines the architecture, deployment strategy, and maintenance procedures for developers working on MEPKit.

## Technology Stack

- **Framework:** Next.js 14/15 (App Router)
- **Styling:** Tailwind CSS & shadcn/ui
- **Math Rendering:** react-katex & remark-math
- **Data Tables:** @tanstack/react-table
- **Charts:** Apache ECharts (`echarts-for-react`)
- **Deployment:** Vercel

## Architecture

The application is built around reusable templates to ensure consistency across hundreds of calculators and data tables:

- `src/components/templates/CalculatorTemplate.tsx`: Standard layout for input forms, results, and SEO metadata.
- `src/components/templates/DataTableTemplate.tsx`: Standard layout for large engineering data tables.
- `src/components/math/Equation.tsx`: KaTeX wrapper for math rendering.

### Content Strategy

Content is primarily driven by MDX, allowing the editorial team to write Markdown while seamlessly embedding React components. Maintainers are responsible for creating the complex interactive components (the actual calculators or chart logic) in `src/components/` and exposing them for editors to use in `.mdx` files.

## Deployment Strategy (Vercel)

MEPKit is deployed to Vercel for maximum performance and edge network distribution. 

### Secrets Management

- **Vercel Environment Variables:** All sensitive API keys and deployment credentials should be stored in Vercel's Environment Variables dashboard.
- **AWS Secrets Manager:** While Vercel handles standard secrets, if runtime requests require dynamic fetching from AWS, the `@aws-sdk/client-secrets-manager` library is installed and ready to be configured.

### Deploying

The Vercel CLI is integrated. Deployment is typically handled automatically via GitHub push to the `main` branch. 

To deploy manually:
```bash
vercel deploy --prod
```

## Creating New Components

When creating a new calculator:
1. Build the logic and form in `src/components/calculators/MyNewCalculator.tsx`.
2. Use `shadcn/ui` components (Inputs, Buttons, Cards) for styling.
3. Ensure it accepts necessary props and manages local state effectively.
4. Provide a clear example in the documentation for the Editorial team.
