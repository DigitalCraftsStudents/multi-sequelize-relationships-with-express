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

const logger = morgan('dev');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(logger);

// Parse any form data from POST requests
app.use(express.urlencoded({extended: true}));

// For starting out UI-first:
// - express
// - template engine
// - express.static (for CSS files, images, etc.)
// - just enough routes to show your HTML files.
//app.use(express.static('public'));
app.get('/list2', (req, res) => {

    res.render('list2');
});

app.get('/list', async (req, res) => {
    let posts = await Post.findAll({
        // include: [{
            // model: Comment,
            // attributes: ['content'],
            // include: User
        // }],
        order: [
            ['id', 'ASC']
        ]
    });

    // cheating because `include` doesn't do what I expect
    for (let p of posts) {
        // manually add the comments
        // from the database.
        p.Comments = await Comment.findAll({
            where: {
                postId: p.id, // where Comment.postId == p.id
                              // (p is the Post I'm looping over)
            },
            include: User,    // Retreive the User
                              // that made this Comment


            order: [                    // Put the Comments
                ['createdAt', 'asc']    // in the order they were
                                        // created
            ]
        });

        // for (let c of p.Comments) {
            // c.User = await User.findOne({
                // where: {
                    // id: c.userId
                // }
            // });
        // }
    }
    
    
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
    const { id } = req.params; // What post are they commenting on?
    
    const post = await Post.findByPk(id);
    const users = await User.findAll({
        order: [
            ['name', 'asc'] // alphabetical order by name
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

