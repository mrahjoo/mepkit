const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const RAW_FLOW_DIR = path.join(__dirname, '../data/PipeFlowCSV');
const RAW_DATA_DIR = path.join(__dirname, '../data/PipeDataCSV');
const PROCESSED_DIR = path.join(__dirname, '../public/data');
const PIPEDATA_DIR = path.join(PROCESSED_DIR, 'pipedata');
const IMAGES_DIR = path.join(__dirname, '../public/pipedata_assets');

// Ensure directories exist
['pipes', 'fluids', 'fittings', 'pipedata'].forEach(dir => {
  const fullPath = path.join(PROCESSED_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// ----------------------------------------
// PipeFlow Data Processing
// ----------------------------------------
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

function processPipeFlowFile(filename) {
  const filePath = path.join(RAW_FLOW_DIR, filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(rawData.trim(), { skipEmptyLines: true });
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
    return;
  }

  const formattedData = dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      let val = row[index] !== undefined ? row[index].trim() : '';
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
}

// ----------------------------------------
// PipeData Processing
// ----------------------------------------
function getCategory(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('flange') || lower.startsWith('fla') || lower.startsWith('fl')) {
    if (lower.includes('elbow')) return 'elbow';
    if (lower.includes('tee')) return 'tee';
    return 'flange';
  }
  if (lower.includes('elbow') || lower.startsWith('elb')) return 'elbow';
  if (lower.includes('pipe') || lower.startsWith('pip')) return 'pipe';
  if (lower.includes('valve') || lower.startsWith('val') || lower.startsWith('vlv')) return 'valve';
  if (lower.includes('fit') || lower.startsWith('ft')) return 'fitting';
  if (lower.includes('cap') || lower.startsWith('cap')) return 'cap';
  if (lower.includes('olet') || lower.startsWith('ol')) return 'olet';
  if (lower.includes('gas') || lower.startsWith('gas')) return 'gasket';
  if (lower.includes('nut')) return 'nut';
  if (lower.includes('orif') || lower.startsWith('orif')) return 'orifice';
  if (lower.includes('blank') || lower.startsWith('bln')) return 'blank';
  if (lower.includes('loop')) return 'loop';
  if (lower.startsWith('grtj')) return 'gasket';
  if (lower.includes('tee')) return 'tee';
  return 'other';
}

const pipeDataCatalog = [];

function processPipeDataFiles() {
  if (!fs.existsSync(RAW_DATA_DIR)) return;
  const files = fs.readdirSync(RAW_DATA_DIR);
  
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const basename = path.basename(file, ext);
    const filePath = path.join(RAW_DATA_DIR, file);

    if (ext === '.png' || ext === '.svg' || ext === '.dxf' || ext === '.jpg' || ext === '.gif') {
      // Copy asset
      fs.copyFileSync(filePath, path.join(IMAGES_DIR, file));
    } else if (ext === '.csv') {
      // Process CSV
      const rawData = fs.readFileSync(filePath, 'utf8');
      const parsed = Papa.parse(rawData.trim(), { skipEmptyLines: true });
      if (parsed.data.length === 0) return;

      // Extract headers and rows
      const headers = parsed.data[0];
      const rows = parsed.data.slice(1);

      const outFilename = basename + '.json';
      const outPath = path.join(PIPEDATA_DIR, outFilename);
      fs.writeFileSync(outPath, JSON.stringify({ headers, rows }, null, 2));

      pipeDataCatalog.push({
        id: basename,
        category: getCategory(basename),
        filename: outFilename
      });
    }
  });

  // Write catalog
  fs.writeFileSync(
    path.join(PROCESSED_DIR, 'pipedata_catalog.json'), 
    JSON.stringify(pipeDataCatalog, null, 2)
  );
}

// Run processors
if (fs.existsSync(RAW_FLOW_DIR)) {
  fs.readdirSync(RAW_FLOW_DIR).forEach(file => {
    if (file.endsWith('.csv')) processPipeFlowFile(file);
  });
}
processPipeDataFiles();

console.log("Data processing complete.");

