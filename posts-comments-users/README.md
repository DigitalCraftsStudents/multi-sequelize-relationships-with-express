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

## SKIP THIS: Set the foreign keys

Lachlan confirmed that it's unnecessary, since these are already mentioned in the `associate()` method.

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


## Define the associations - DO NOT CALL `belongsToMany()`

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
        User.hasMany(models.Comment, {
            foreignKey: 'userId'
        });
    }
```

### `models/post.js`

```js
    static associate(models) {
        Post.hasMany(models.Comment, {
            foreignKey: 'postId'
        });
    }
```

## Run the migrations

## Adding image upload


Use the [multer](http://expressjs.com/en/resources/middleware/multer.html) middleware to handle file uploads.

- Images will be saved to the `public/uploads` directory.
- The database stores the path to the image.
- The template displays an img tag. e.g., `<img src="/uploads/path-to-image.png">`

### Install the `multer` module

It handles files (images, PDFs, etc.) uploaded in a *multipart* form.

```sh
npm i multer
```

### Configure `multer`

In your `index.js` import and configure `multer`

```js
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
```

Make sure the directory exists:

```sh
mkdir public
mkdir public/uploads
```

### Create a multipart form

```html
<form method="post" enctype="multipart/form-data">
  <input type="file" name="content" />
</form>
```

### Process the form

```js
app.post('/post/new', upload.single('content'), async (req, res) => {
    // req.file is the `content` file
    const { file } = req;
    console.log('========== filename =========');
    console.log(file.destination, file.filename);
    
    const { userId, title } = req.body;
    const post = await Post.create({
        title,
        content: file.destination + file.filename
    });
    // Not tracking which user created the post.
    // In a real app, we would.
    res.redirect('/list') ;
})
```
