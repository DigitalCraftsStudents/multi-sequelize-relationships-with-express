require('dotenv').config();    // don't forget to require dotenv

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');

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

// Parse any form data from POST requests
app.use(express.urlencoded({extended: true}));

app.get('/list', async (req, res) => {
    const posts = await Post.findAll({
        include: [{
            model: Comment,
            attributes: ['content'],
            include: User
        }],
        order: [
            ['id', 'ASC']
        ]
    });
    // print one
    console.log(JSON.stringify(posts[0]));
    res.render('list', {
        locals: {
            posts
        },
        ...layout
    })
});

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
        userId,
        postId: id
    });
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

