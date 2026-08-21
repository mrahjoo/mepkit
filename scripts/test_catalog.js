const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../data/PipeDataCSV');
const files = fs.readdirSync(RAW_DIR);

const catalog = [];

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
  if (lower.startsWith('grtj')) return 'gasket'; // ring type joint
  return 'other';
}

files.forEach(file => {
  if (file.endsWith('.csv')) {
    const category = getCategory(file);
    const id = file.replace('.csv', '');
    catalog.push({
      id,
      category,
      filename: file,
      // We will look for images matching the pattern soon
    });
  }
});

const grouped = catalog.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

console.log('Categories:', grouped);
