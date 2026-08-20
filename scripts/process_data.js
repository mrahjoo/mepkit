const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const RAW_DIR = path.join(__dirname, '../data/PipeFlowCSV');
const PROCESSED_DIR = path.join(__dirname, '../public/data'); // Place in public to be fetchable if needed, or importable

// Ensure directories exist
['pipes', 'fluids', 'fittings'].forEach(dir => {
  const fullPath = path.join(PROCESSED_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const pipeHeaders = [
  'material', 'schedule', 'roughness', 'size_id', 
  'size_metric', 'size_imperial', 'wall_thickness', 
  'outer_diameter', 'weight'
];

const fluidHeaders = [
  'name', 'formula', 'temperature_k', 'pressure_kpa', 
  'density', 'viscosity_cp', 'vapor_pressure_kpa', 'flag'
];

const fittingHeaders = [
  'size_mm', 'type_id', 'code', 'size_metric', 
  'size_imperial', 'description', 'k_factor'
];

function processFile(filename) {
  const filePath = path.join(RAW_DIR, filename);
  const rawData = fs.readFileSync(filePath, 'utf8');

  // Parse CSV (no header row in the file)
  const parsed = Papa.parse(rawData.trim(), { skipEmptyLines: true });
  
  if (parsed.errors.length) {
    console.warn(`Warnings while parsing ${filename}:`, parsed.errors);
  }

  // The first row is metadata like format version, we slice it off.
  const dataRows = parsed.data.slice(1);

  let category = '';
  let headers = [];
  
  if (filename.startsWith('PipeTables_')) {
    category = 'pipes';
    headers = pipeHeaders;
  } else if (filename.startsWith('FluidTables_')) {
    category = 'fluids';
    headers = fluidHeaders;
  } else if (filename.startsWith('FittingTables_')) {
    category = 'fittings';
    headers = fittingHeaders;
  } else {
    return; // Ignore other files
  }

  // Convert array rows to object arrays
  const formattedData = dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      let val = row[index] !== undefined ? row[index].trim() : '';
      // Try to parse numbers
      if (!isNaN(val) && val !== '') {
        val = parseFloat(val);
      }
      obj[header] = val;
    });
    return obj;
  });

  const outFilename = filename.replace('.csv', '.json');
  const outPath = path.join(PROCESSED_DIR, category, outFilename);
  
  fs.writeFileSync(outPath, JSON.stringify(formattedData, null, 2));
  console.log(`Processed ${filename} -> ${outFilename}`);
}

const files = fs.readdirSync(RAW_DIR);
files.forEach(file => {
  if (file.endsWith('.csv')) {
    processFile(file);
  }
});

console.log("Data processing complete.");
