# Pipe Flow Expert CSV Data Structures

This document describes the structure of the CSV files generated from the original `Pipe Flow Expert` configuration files (`.pfpi`, `.pfli`, `.pffi`). 

These CSV files can be opened in spreadsheet applications like Microsoft Excel, Google Sheets, or processed programmatically using Python (e.g., pandas), R, or any other data analysis tool.

## 1. PipeTables (`PipeTables_*.csv`)

These files contain the specifications for various pipe materials and schedules.

**Row 1**: Metadata (e.g., `["1.05", "Aluminium_Sch40.pfpi", ""]`). This usually indicates the format version and the original filename.

**Row 2 and onwards**: Data rows representing specific pipe sizes.
The columns are structured as follows:
- **Column 1**: Material Name (e.g., `Aluminium`, `Cast Iron`)
- **Column 2**: Schedule / Class (e.g., `Sch. 40`, `Class C`)
- **Column 3**: Internal Roughness (typically in inches, e.g., `0.000059000` for Aluminum, `0.015748` for Cast Iron)
- **Column 4**: Nominal Size ID (Numeric identifier, e.g., `50`)
- **Column 5**: Nominal Size in Metric (e.g., `50 mm`)
- **Column 6**: Nominal Size in Imperial (e.g., `2"`)
- **Column 7**: Wall Thickness (typically in inches, e.g., `0.154000000` for 2" Sch 40)
- **Column 8**: Outer Diameter (typically in inches, e.g., `2.375000000` for 2" pipe)
- **Column 9**: Weight per unit length (typically lbs/ft, e.g., `1.269000000`)

---

## 2. FluidTables (`FluidTables_*.csv`)

These files contain the physical properties of various fluids (liquids and gases) at different temperatures.

**Row 1**: Metadata (e.g., `["1.03", "", ""]`). Indicates the format version.

**Row 2 and onwards**: Data rows representing fluid properties.
The columns are structured as follows:
- **Column 1**: Fluid Name (e.g., `Water`, `Air`)
- **Column 2**: Chemical Formula (e.g., `H2 O`)
- **Column 3**: Temperature in Kelvin (e.g., `293.150` for 20°C)
- **Column 4**: Pressure (Gauge pressure, often `0.000` for standard liquids)
- **Column 5**: Density in kg/m³ (e.g., `998.000` for water at 20°C)
- **Column 6**: Dynamic Viscosity in Centipoise (cP) or mPa·s (e.g., `1.002` for water at 20°C)
- **Column 7**: Vapor Pressure in kPa (e.g., `2.339000` for water at 20°C)
- **Column 8**: Additional parameter / Flag (Often `0` for standard records)

---

## 3. FittingTables (`FittingTables_*.csv`)

These files contain the specifications for various pipe fittings and valves, including their friction loss coefficients (K-factors).

**Row 1**: Metadata (e.g., `["6.35", "", ""]`). Indicates the format version.

**Row 2 and onwards**: Data rows representing specific fitting sizes and types.
The columns are structured as follows:
- **Column 1**: Nominal Size in mm (Numeric, e.g., `15`)
- **Column 2**: Fitting Type ID (Numeric category ID, e.g., `3`)
- **Column 3**: Fitting Code / Abbreviation (e.g., `E45` for 45-degree elbow, `Gate` for Gate Valve)
- **Column 4**: Size Label in Metric (e.g., `15 mm`)
- **Column 5**: Size Label in Imperial (e.g., `1/2"`)
- **Column 6**: Description (e.g., `Elbow 45 deg.`)
- **Column 7**: K-factor (Friction loss coefficient, e.g., `0.43`)

## How to use them

- **Engineering Calculations**: You can load these CSVs into Python (pandas) or MATLAB to automate hydraulic calculations, pressure drop estimations, or pipe network analysis without relying on the Pipe Flow Expert GUI.
- **Data Lookup**: Use Excel's `VLOOKUP` or `XLOOKUP` functions to easily find pipe inner diameters or K-factors based on nominal sizes.
- **Importing to other software**: Standard CSV format is widely supported, making it easy to migrate this database of materials and fluids into other engineering software, CAD tools, or custom internal company tools.
