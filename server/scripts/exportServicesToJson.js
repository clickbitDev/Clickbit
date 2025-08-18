const fs = require('fs');
const path = require('path');

// Paths to the frontend service data files
const serviceDataPath = path.resolve(__dirname, '../../client/src/services/serviceData.ts');
const serviceDetailDataPath = path.resolve(__dirname, '../../client/src/services/serviceDetailData.ts');
const outputPath = path.resolve(__dirname, '../seeders/exportedServices.json');

// Helper to extract JS objects from TS files (very basic, assumes export const ... = {...})
function extractObjectFromFile(filePath, exportName) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Allow for optional type annotation and flexible whitespace/line breaks
  const regex = new RegExp(`export const ${exportName}(\s*:[^=]+)?\s*=\s*(\{[\s\S]*?\});`, 'm');
  const match = content.match(regex);
  if (!match) throw new Error(`Could not find export ${exportName} in ${filePath}`);
  return eval('(' + match[2] + ')');
}

const servicesByCategory = extractObjectFromFile(serviceDataPath, 'services');
const serviceDetails = extractObjectFromFile(serviceDetailDataPath, 'serviceDetails');

// Flatten services and merge with details
const allServices = [];
for (const categoryKey in servicesByCategory) {
  const category = servicesByCategory[categoryKey];
  for (const item of category.items) {
    const slug = item.href.replace('/services/', '');
    const detail = serviceDetails[slug] || {};
    allServices.push({
      name: item.name,
      slug,
      description: item.desc || detail.title || '',
      category: category.name,
      headerImage: detail.headerImage || null,
      features: detail.sections ? detail.sections.map(s => s.title) : null,
      pricing: detail.pricing || null,
      sections: detail.sections || null,
      isPopular: !!item.popular,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

fs.writeFileSync(outputPath, JSON.stringify(allServices, null, 2));
console.log(`Exported ${allServices.length} services to ${outputPath}`); 