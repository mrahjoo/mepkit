# Pipe Data CSV Structures

This document describes the structure of the `PipeDataCSV` directory. Unlike `PipeFlowCSV` which primarily focuses on fluid properties and flow calculations, `PipeDataCSV` contains a comprehensive database of **dimensional, weight, and specification data** for physical piping components, along with their graphical and CAD representations.

## Directory Overview

The directory has a flat structure containing over 1,000 files, primarily consisting of three types of files:
1. **`.csv` (Comma Separated Values)**: The core database containing dimensions, weights, and properties for various piping components.
2. **`.dxf` (Drawing Exchange Format)**: CAD files representing the 2D/3D shapes of the components, ready for import into drafting software like AutoCAD.
3. **`.png` / `.svg` (Images)**: Graphical representations, icons, and dimension diagrams of the components, often used in user interfaces or documentation.

## 1. CSV Data Files

The CSV files store the tabular data for different classes and types of piping elements. 

### Common Naming Conventions:
- **Pipes**: `pipe10.csv`, `pipe40.csv` (Numbers denote pipe schedule, e.g., Schedule 10, Schedule 40).
- **Flanges**: `flg150.csv`, `flg300.csv` (Numbers denote pressure class, e.g., 150#, 300#).
- **Fittings**: `45elbow10.csv`, `90elbow40.csv`, `cap10.csv` (Indicates fitting type and schedule).
- **Socket/Butt-Welded Fittings**: `ftsw*.csv` (Socket-welded), `ftbw*.csv` (Butt-welded), `ftsc*.csv` (Screwed/Threaded).
- **Gaskets**: `gflt*.csv` (Flat gaskets), `grtj*.csv` (Ring type joint gaskets).

### Internal Structure:
- **Row 1**: Often contains numerical mappings, metadata, or a specific header count (e.g., `13,2-DN,3-OD,4-WallThk...`).
- **Row 2**: Typically contains the descriptive column headers (e.g., `nb`, `od`, `thickness`, `hub-x`).
- **Row 3 and onwards**: The actual dimensional data, usually indexed by the Nominal Bore (NB) or Nominal Pipe Size (NPS) (e.g., `0+1/2`, `3/4`, `1`, `2`). Fields include Outer Diameter (OD), Wall Thickness, Weight (Kg or lbs), and specific geometric dimensions (like hub lengths or radius).

## 2. CAD Drawings (`.dxf`) & Images (`.png` / `.svg`)

Alongside the CSV tables, the directory contains graphical files used for visual representation and drafting.

- **`.dxf` files**: Standardized CAD drawings. These allow engineers to import the exact geometrical shape of a component directly into their design software.
- **`.png` and `.svg` files**: These are often dimensioned diagrams or icons illustrating what the parameters in the CSV file (like `hub-x`, `thickness`) correspond to on the physical component. 

## How the Files are Connected

The files are tightly coupled through **base naming conventions**. A single piping component type is often represented by a triplet of files sharing the same prefix. 

For example, looking at the butt-welded fitting type 1 (`ftbw1`):
- **`ftbw1.csv`**: Contains the dimensional data table for this fitting across various sizes.
- **`ftbw1.dxf`**: Contains the CAD drawing for this fitting.
- **`ftbw1.png` / `ftbw1.svg`**: Contains the visual diagram showing the fitting and its dimension labels (which map back to the columns in the `.csv`).

By sharing the same base filename (e.g., `grtj1.csv`, `grtj1.dxf`, `grtj1.png` for Ring Type Joint Gasket 1), external applications or scripts can easily link the tabular engineering data with its corresponding visual and CAD assets.

## How to use them

- **Piping Design & Drafting**: Scripts can be written to look up a component's dimensions in the `.csv` and automatically generate or place the corresponding `.dxf` in a CAD model.
- **Bill of Materials (BOM) & Weight Estimation**: The `.csv` files contain weight-per-unit metrics (e.g., pipe weight, flange weight) which can be aggregated programmatically to estimate the total dry/wet weight of a piping system.
- **Application Development**: The combination of `.csv` databases and `.png`/`.svg` icons makes this directory a complete backend asset folder for building piping reference applications or mobile apps.
