'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
// See note in post.js about why this is commented out.
        // User.belongsToMany(models.Post, {
            // through: models.Comment,
            // foreignKey: 'userId'
        // });
        User.hasMany(models.Comment, {
            foreignKey: 'userId'
        });
    }
  };
  User.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
