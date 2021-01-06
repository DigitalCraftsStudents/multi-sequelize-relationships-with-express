'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        Comment.belongsTo(models.Post, {
            foreignKey: 'postId',            
        });
        Comment.belongsTo(models.User, {
            foreignKey: 'userId',            
        });
    }
  };
  Comment.init({
    content: DataTypes.STRING,
      postId: {
          type: DataTypes.INTEGER,
          references: 'Post',
          key: 'id'
      },
      userId: {
          type: DataTypes.INTEGER,
          references: 'User',
          key: 'id'
      }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
