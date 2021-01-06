'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

      return await queryInterface.bulkInsert('Heroes', [
          { name: 'Batman', createdAt: new Date(), updatedAt: new Date() },
          { name: 'Wonder Woman', createdAt: new Date(), updatedAt: new Date()  },
          { name: 'Hermione Granger', createdAt: new Date(), updatedAt: new Date()  },
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return await queryInterface.bulkDelete('Heroes', null, {});
  }
};
