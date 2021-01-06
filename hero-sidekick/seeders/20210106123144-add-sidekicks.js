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
      return await queryInterface.bulkInsert('Sidekicks', [
          { name: 'Harry Potter', createdAt: new Date(), updatedAt: new Date()  },
          { name: 'Steve', createdAt: new Date(), updatedAt: new Date()  },
          { name: 'Robin', createdAt: new Date(), updatedAt: new Date()  },
          { name: 'Alfred', createdAt: new Date(), updatedAt: new Date()  },
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return await queryInterface.bulkDelete('Sidekicks', null, {});
  }
};

