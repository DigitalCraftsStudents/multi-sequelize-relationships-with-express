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
     return await queryInterface.bulkInsert('Posts', [
         { title: 'First post', content: 'important!', createdAt: new Date(), updatedAt: new Date() },
         { title: 'Second post', content: 'more words', createdAt: new Date(), updatedAt: new Date()  },
         { title: 'Last post', content: 'much wordings', createdAt: new Date(), updatedAt: new Date()  },
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete('Posts', null, {});
  }
};
