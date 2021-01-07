'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
/*
Per Lachlan, use the model object, not the table name string.
But while experimenting, calling this breaks Comment's magic methods.
*/
        // Post.belongsToMany(models.User, {
            // through: models.Comment,
            // foreignKey: 'postId'
        // });
        Post.hasMany(models.Comment, {
            foreignKey: 'postId'
        });
    }
  };
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
