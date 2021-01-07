require('dotenv').config();    // don't forget to require dotenv

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');

const UPLOAD_URL = '/uploads/';

const multer = require('multer');
const upload = multer({ dest: 'public' + UPLOAD_URL });


const { layout } = require('./utils');
const { Post, Comment, User } = require('./models');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const logger = morgan('tiny');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(logger);

app.use(express.static('public'));

// Parse any form data from POST requests
app.use(express.urlencoded({extended: true}));

app.get('/list', async (req, res) => {
    let posts = await Post.findAll({
        // This works, only because I removed the `belongsToMany()` calls
        include: [{
            model: Comment,
            attributes: ['content', 'createdAt'],
            include: User,
            //order: [
            //     // ['Comment', 'id', 'asc']
            //     // ['Comments', 'createdAt', 'desc']
            //]
        }],
        order: [
            ['createdAt', 'desc'],
            ['Comments', 'createdAt', 'asc']
        ]
    });
    
    // print one
    console.log(JSON.stringify(posts[0], null, 4));
    res.render('list', {
        locals: {
            posts
        },
        ...layout
    })
});

app.get('/post/new', async (req, res) => {
    res.render('add-post', {
        locals: {
            
        },
        ...layout
    })
});

app.post('/post/new', upload.single('content'), async (req, res) => {
    // req.file is the `content` file
    const { file } = req;
    console.log('========== filename =========');
    console.log(file.destination, file.filename);
    
    const { userId, title } = req.body;
    const post = await Post.create({
        title,
        content: UPLOAD_URL + file.filename
    });
    // Not tracking which user created the post.
    // In a real app, we would.
    res.redirect('/list') ;
})

app.get('/post/:id/comment', async (req, res) => {
    const { id } = req.params;
    
    const post = await Post.findByPk(id);
    const users = await User.findAll({
        order: [
            ['name', 'asc']
        ]
    })

    res.render('add-comment', {
        locals: {
            post,
            users
        },
        ...layout
    })
});
app.post('/post/:id/comment', async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.create({
        content,
        // userId,
        // postId: id
    });
    // These dont' work either
    await comment.setUser(userId);
    await comment.setPost(id);
    await comment.save();

    // Neither do these.
    // comment.UserId = userId;
    // comment.PostId = id;
    // await comment.save();
    res.redirect('/list');
});

app.get('/', (req, res) => {
    res.render('home', {
        ...layout
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});

