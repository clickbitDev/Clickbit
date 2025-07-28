const { sequelize } = require('../config/database');
const PortfolioItem = require('../models/PortfolioItem');

const markFeaturedPortfolio = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Get the first 6 published portfolio items and mark them as featured
    const items = await PortfolioItem.findAll({
      where: { status: 'published' },
      order: [['created_at', 'ASC']],
      limit: 6
    });

    console.log(`Found ${items.length} portfolio items to mark as featured.`);

    for (const item of items) {
      await item.update({ featured: true });
      console.log(`Marked "${item.title}" as featured.`);
    }

    console.log('Successfully marked portfolio items as featured!');
    
    // Show summary
    const featuredCount = await PortfolioItem.count({ where: { featured: true } });
    const totalCount = await PortfolioItem.count({ where: { status: 'published' } });
    
    console.log(`\nSummary:`);
    console.log(`- Featured portfolio items: ${featuredCount}`);
    console.log(`- Total published portfolio items: ${totalCount}`);

  } catch (error) {
    console.error('Error marking portfolio items as featured:', error);
  } finally {
    await sequelize.close();
  }
};

markFeaturedPortfolio(); 