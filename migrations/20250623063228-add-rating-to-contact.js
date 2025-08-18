'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('contacts', 'rating', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   comment: 'Review rating (1-5 stars)'
    // });
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('contacts', 'rating');
  }
};
