'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('reviews', [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        company: 'Tech Innovations Ltd',
        position: 'CTO',
        rating: 5,
        review_text: 'ClickBit transformed our entire digital infrastructure. Their team delivered a comprehensive solution that exceeded our expectations. The project was completed on time and within budget.',
        service_type: 'Web Development',
        project_type: 'Enterprise Platform',
        status: 'approved',
        is_featured: true,
        display_order: 1,
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@startup.com',
        company: 'StartupFlow',
        position: 'Founder & CEO',
        rating: 5,
        review_text: 'Working with ClickBit was a game-changer for our startup. They built us a scalable platform that grew with our business. Highly recommend their expertise!',
        service_type: 'Mobile App Development',
        project_type: 'Startup MVP',
        status: 'approved',
        is_featured: true,
        display_order: 2,
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Emma Williams',
        email: 'emma@designstudio.com',
        company: 'Creative Design Studio',
        position: 'Creative Director',
        rating: 5,
        review_text: 'The team at ClickBit understood our vision perfectly. They created a beautiful, functional website that truly represents our brand. The attention to detail was exceptional.',
        service_type: 'Design & Branding',
        project_type: 'Brand Website',
        status: 'approved',
        is_featured: true,
        display_order: 3,
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'David Rodriguez',
        email: 'david@retailplus.com',
        company: 'RetailPlus',
        position: 'Operations Manager',
        rating: 5,
        review_text: 'Our e-commerce platform built by ClickBit has increased our online sales by 300%. The user experience is smooth and the admin panel makes management easy.',
        service_type: 'E-commerce Development',
        project_type: 'Online Store',
        status: 'approved',
        is_featured: false,
        display_order: 4,
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa@consulting.com',
        company: 'Business Consulting Group',
        position: 'Senior Partner',
        rating: 5,
        review_text: 'ClickBit delivered a comprehensive business solution that streamlined our operations. Their ongoing support has been excellent.',
        service_type: 'Business Systems',
        project_type: 'Process Automation',
        status: 'approved',
        is_featured: false,
        display_order: 5,
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'James Wilson',
        email: 'james@example.com',
        rating: 4,
        review_text: 'Great service and professional team. Looking forward to working together on future projects.',
        service_type: 'Consulting',
        status: 'pending',
        is_featured: false,
        display_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reviews', null, {});
  }
};