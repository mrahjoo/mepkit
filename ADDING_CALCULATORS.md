# Adding Calculators to MEPKit

This guide explains the standard workflow for adding a new engineering calculator to the MEPKit application. 

MEPKit uses **Next.js (App Router)** and **React Server Components** by default. Because calculators require interactivity and state management (e.g., handling user inputs, real-time math), the core calculator logic must be placed in a **Client Component**, which is then rendered by a **Server Component** page.

## Workflow Summary

To add a new calculator, you will generally follow these three steps:

1. **Create the Client Component** containing the UI and math logic.
2. **Create the Page Wrapper** to serve the component and handle SEO metadata.
3. **Update the Calculators Hub** to link to your new calculator.

---

### Step 1: Create the Client Component

Create a new file in `src/components/calculators/`, for example: `src/components/calculators/MyNewCalc.tsx`.

1. **Use the `'use client';` directive** at the very top of the file.
2. **State Management:** Use standard React hooks (`useState`, `useEffect`) to manage user inputs and calculate results in real-time.
3. **Styling & UI:** 
   - Use Tailwind CSS classes for styling (e.g., `grid`, `flex`, `space-y-4`).
   - Use existing `shadcn-ui` components for form elements (`@/components/ui/input`, `@/components/ui/label`, `@/components/ui/select`, etc.) to maintain a consistent, premium design.

```tsx
// src/components/calculators/MyNewCalc.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function MyNewCalc() {
  const [inputVal, setInputVal] = useState('10');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    // Perform calculation logic
    const val = parseFloat(inputVal);
    if (!isNaN(val)) {
      setResult(val * 2); // Example logic
    }
  }, [inputVal]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
       {/* Calculator UI goes here */}
    </div>
  );
}
```

### Step 2: Create the Page Wrapper

Create a new route in the `src/app/calculators/` directory, for example: `src/app/calculators/my-new-calc/page.tsx`.

1. **Keep it as a Server Component** (do not add `'use client'`).
2. **Define Metadata:** Export a `metadata` object for SEO.
3. **Render the Component:** Import and render your Client Component inside a container.

```tsx
// src/app/calculators/my-new-calc/page.tsx
import React from 'react';
import { MyNewCalc } from '@/components/calculators/MyNewCalc';

export const metadata = {
  title: 'My New Calculator | MEPKit',
  description: 'Calculate [Metric] based on [Inputs].',
};

export default function MyNewCalcPage() {
  return (
    <div className="container py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">My New Calculator</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
        A brief description of what this calculator does and the formula it uses.
      </p>
      
      <MyNewCalc />
    </div>
  );
}
```

### Step 3: Update the Calculators Hub

Open `src/app/calculators/page.tsx`. This file contains the grid of all available calculators.

Find the `calculators` array inside the component and append your new calculator as an object:

```tsx
// src/app/calculators/page.tsx
const calculators = [
  // ... existing calculators
  { 
    title: 'My New Calculator', 
    href: '/calculators/my-new-calc', 
    desc: 'Calculate [Metric] based on [Inputs].' 
  },
];
```

### Step 4: Verify and Commit

1. Run `npm run dev` to start the local development server.
2. Navigate to `http://localhost:3000/calculators` and ensure your calculator card appears.
3. Click the card, test the inputs, and verify the math logic works properly.
4. Run `npm run build` to ensure there are no TypeScript or Next.js build errors (e.g., escaping JSX characters like `{}` properly).
5. Commit and push your code to the `main` branch. Vercel will automatically deploy the changes.
