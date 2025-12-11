const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const Team = require('../models/Team');

const teamData = [
  { 
    name: 'Kauser Ahmed', 
    role: 'Digital Guardian', 
    role_label: 'Guardian', 
    image: '/images/team/kauser-ahmed.jpg', 
    email: 'methel@clickbit.com.au', 
    phone: '+61 480 228 744',
    display_order: 1 
  },
  { 
    name: 'Sanjida Parvin', 
    role: 'HR & Accounts', 
    role_label: 'Strategist', 
    image: '/images/team/sanjida-parvin.png', 
    email: 'sanjida@clickbit.com.au', 
    phone: null,
    display_order: 2 
  },
  { 
    name: 'Rafiqul Islam', 
    role: 'Front-End Alchemist', 
    role_label: 'Creator', 
    image: '/images/team/rafiqul-islam.png', 
    email: 'rafiqul@clickbit.com.au', 
    phone: null,
    display_order: 3 
  },
  { 
    name: 'Farhan Bin Matin', 
    role: 'Organic Growth Engineer', 
    role_label: 'Optimizer', 
    image: '/images/team/farhan-bin-matin.png', 
    email: 'farhan@clickbit.com.au', 
    phone: '+61 422 512 130',
    display_order: 4 
  },
  { 
    name: 'Azwad Bhuiyan', 
    role: 'Technical Specialist', 
    role_label: 'Specialist', 
    image: '/images/team/azwad-bhuiyan.png', 
    email: 'azwad@clickbit.com.au', 
    phone: '+61 401 222 838',
    display_order: 5 
  },
  { 
    name: 'Talha Zubaer', 
    role: 'Backend Developer', 
    role_label: 'Developer', 
    image: '/images/team/talha-zubaer.png', 
    email: 'zubaer@clickbit.com.au', 
    phone: '+61 452 624 857',
    display_order: 6 
  }
];

async function seedTeam() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Create table if it doesn't exist
    await Team.sync();
    console.log('Team table synced.');

    // Clear existing data
    await Team.destroy({ where: {} });
    console.log('Cleared existing team members.');

    // Insert team data
    const createdMembers = await Team.bulkCreate(teamData);
    console.log(`Created ${createdMembers.length} team members successfully.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding team data:', error);
    process.exit(1);
  }
}

seedTeam();