'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // This migration is redundant as the `header_image` column already exists.
    // await queryInterface.addColumn('services', 'headerImage', {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    //   comment: 'URL for the service header image'
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('services', 'headerImage');
  }
}; 