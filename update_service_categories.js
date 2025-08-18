const { Service } = require('./server/models');

const categoryUpdates = {
  'Web Development': 'Development',
  'Mobile App Development': 'Development',
  'Custom Desktop Software': 'Development',
};

async function updateServiceCategories() {
  try {
    console.log('🔄 Starting service category updates...');
    
    for (const [oldCategory, newCategory] of Object.entries(categoryUpdates)) {
      console.log(`📝 Updating services from category "${oldCategory}" to "${newCategory}"`);
      
      const [count] = await Service.update(
        { category: newCategory },
        { where: { category: oldCategory } }
      );
      
      console.log(`✅ Updated ${count} services from category "${oldCategory}"`);
    }
    
    console.log('🎉 Service category updates completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating service categories:', error);
  }
}

// Run the update
updateServiceCategories()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });