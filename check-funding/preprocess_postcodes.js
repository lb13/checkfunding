// preprocess_postcodes.js
const fs = require('fs');
const csv = require('csv-parser');

const inputPath = './src/app/data/postcode_authorities.csv';
const outputPath = './src/app/data/postcode_authorities.json';

const postcodeMap = {};

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    if (!row.EffectiveTo) {
      const normalized = row.Postcode.replace(/\s+/g, '').toUpperCase();
      postcodeMap[normalized] = `${row.Area} (${row.SourceOfFunding})`;
    }
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(postcodeMap, null, 2));
    console.log('Done! Output written to', outputPath);
  });