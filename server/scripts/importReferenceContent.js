const { Content } = require('../models');
const { logger } = require('../utils/logger');

const importReferenceContent = async () => {
  try {
    logger.info('Starting import of reference content...');

    // Import enhanced process phases
    const enhancedProcessPhases = [
      {
        id: 1,
        mainIcon: 'ClipboardList',
        title: 'Planning',
        subtitle: '& Requirements',
        description: 'We define the project\'s scope, goals, and foundational needs, aligning expectations for a clear roadmap ahead.',
        color: 'text-[#1FBBD2]',
        bgColor: 'hover:bg-cyan-50',
        darkBgColor: 'dark:hover:bg-cyan-900/20',
        deliverables: [
          { text: 'Detailed Project Scope Document', icon: 'FileText' },
          { text: 'Stakeholder Register', icon: 'Users' },
          { text: 'User & Technical Requirements', icon: 'ClipboardCheck' },
          { text: 'Draft Project Plan & Schedule', icon: 'Calendar' },
          { text: 'Initial Risk Assessment', icon: 'ShieldAlert' },
        ]
      },
      {
        id: 2,
        mainIcon: 'Palette',
        title: 'Design',
        subtitle: '& Development',
        description: 'Transforming concepts into functional realities, we craft user-centric designs and build robust, scalable solutions.',
        color: 'text-[#F39C12]',
        bgColor: 'hover:bg-amber-50',
        darkBgColor: 'dark:hover:bg-amber-900/20',
        deliverables: [
          { text: 'System Architecture Design', icon: 'Network' },
          { text: 'UI/UX Mockups & Prototypes', icon: 'Layout' },
          { text: 'Alpha Version of Modules/Components', icon: 'Code' },
          { text: 'Unit Test Cases', icon: 'TestTube' },
        ]
      },
      {
        id: 3,
        mainIcon: 'CheckCircle',
        title: 'Testing',
        subtitle: '& Quality Assurance',
        description: 'Rigorous testing ensures every component functions flawlessly, delivering a high-quality, reliable product ready for deployment.',
        color: 'text-emerald-500',
        bgColor: 'hover:bg-emerald-50',
        darkBgColor: 'dark:hover:bg-emerald-900/20',
        deliverables: [
          { text: 'Integrated System (Beta Version)', icon: 'Package' },
          { text: 'Comprehensive Test Plan & Cases', icon: 'CheckSquare' },
          { text: 'User Acceptance Testing (UAT) Sign-off', icon: 'Signature' },
          { text: 'Performance & Security Reports', icon: 'BarChart2' },
        ]
      },
      {
        id: 4,
        mainIcon: 'Rocket',
        title: 'Launch',
        subtitle: '& Deployment',
        description: 'The culmination of our efforts: successful system deployment, user empowerment, and dedicated post-launch support.',
        color: 'text-rose-500',
        bgColor: 'hover:bg-rose-50',
        darkBgColor: 'dark:hover:bg-rose-900/20',
        deliverables: [
          { text: 'Deployment Plan', icon: 'Upload' },
          { text: 'User Manuals & Training Materials', icon: 'Book' },
          { text: 'System Go-Live', icon: 'Zap' },
          { text: 'Post-Launch Support Plan', icon: 'LifeBuoy' },
        ]
      },
    ];

    // Import enhanced mission points (8 points instead of 4)
    const enhancedMissionPoints = [
      {
        icon: 'Users',
        title: 'Customer Centric',
        description: 'Personalized services that cater to your specific needs, ensuring that our solutions fit your business perfectly.',
      },
      {
        icon: 'Handshake',
        title: 'Collaborative Partnership',
        description: 'We work alongside you, maintaining open communication to fully understand your vision and incorporate your feedback into our strategies.',
      },
      {
        icon: 'Gem',
        title: 'Commitment to Quality',
        description: 'Our expert team stays updated on industry trends, delivering innovative solutions with a strong focus on quality.',
      },
      {
        icon: 'Target',
        title: 'Achieving Goals Together',
        description: 'We measure our success by your results. Your achievements are milestones for us, and we celebrate every step forward together.',
      },
      {
        icon: 'BookCopy',
        title: 'Expertise in Multiple Areas',
        description: 'From web development to digital marketing and hardware support, our experienced team brings a wealth of knowledge to every project.',
      },
      {
        icon: 'ShieldAlert',
        title: 'Proactive Support, Not Just Reactive',
        description: 'Regular maintenance and monitoring. Preventive measures to avoid issues and ensure your systems are always running smoothly.',
      },
      {
        icon: 'LifeBuoy',
        title: 'Complete IT Support, Start to Finish',
        description: 'From initial planning and installation to ongoing maintenance and emergency repairs, we offer true end-to-end support.',
      },
      {
        icon: 'FileText',
        title: 'Honest, Transparent Pricing',
        description: 'Clear, straightforward pricing with no hidden fees or surprises. We believe in building trust through transparency.',
      },
    ];

    // Update or create process phases
    await Content.upsert({
      title: 'Process Phases',
      slug: 'process-phases',
      content_type: 'custom',
      content: JSON.stringify(enhancedProcessPhases),
      status: 'published'
    });

    // Update or create mission points
    await Content.upsert({
      title: 'Mission Points',
      slug: 'mission-points',
      content_type: 'custom',
      content: JSON.stringify(enhancedMissionPoints),
      status: 'published'
    });

    logger.info('Successfully imported enhanced process phases and mission points');
    logger.info(`- Process phases: ${enhancedProcessPhases.length} phases with detailed deliverables`);
    logger.info(`- Mission points: ${enhancedMissionPoints.length} comprehensive mission values`);

  } catch (error) {
    logger.error('Error importing reference content:', error);
    throw error;
  }
};

// Run the import if this script is executed directly
if (require.main === module) {
  const { connectDatabase } = require('../config/database');
  
  connectDatabase()
    .then(() => {
      logger.info('Database connected, starting import...');
      return importReferenceContent();
    })
    .then(() => {
      logger.info('Reference content import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Reference content import failed:', error);
      process.exit(1);
    });
}

module.exports = { importReferenceContent }; 