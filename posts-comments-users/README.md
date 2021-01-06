# Posts, Comments, Users

Users and Posts stand on their own (they don't have a direct relationship).
A User can Comment on a Post.

That means that the Comment will have a `userId` field and a `postId` field.


## Generate the models

```sh
npx sequelize model:generate --name Post --attributes 'title:string, content:string'
npx sequelize model:generate --name Comment --attributes 'content:string, postId:integer, userId:integer'
npx sequelize model:generate --name User --attributes 'name:string'
```

## Set the foreign keys

In `models/comment.js`:

```js
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
```


## Define the associations

### `models/comment.js`

```js
    static associate(models) {
        Comment.belongsTo(models.Post, {
            foreignKey: 'postId',
        });
        Comment.belongsTo(models.User, {
            foreignKey: 'userId',
        });
    }
```

### `models/user.js`

```js
    static associate(models) {
        User.belongsToMany(models.Post, {
            through: 'Comment',
            foreignKey: 'userId'
        });
        User.hasMany(models.Comment, {
            foreignKey: 'userId'
        });
    }
```

### `models/post.js`

```js
    static associate(models) {
        Post.belongsToMany(models.User, {
            through: 'Comment',
            foreignKey: 'postId'
        });
        Post.hasMany(models.Comment, {
            foreignKey: 'postId'
        });
    }
```

## Run the migrations
