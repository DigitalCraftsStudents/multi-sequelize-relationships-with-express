require('dotenv').config();    // don't forget to require dotenv

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');

const { layout } = require('./utils');
const { Hero, Sidekick } = require('./models');

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
    const heroes = await Hero.findAll({
        include: Sidekick,
        order: [
            ['id', 'ASC']
        ]
    });
    console.log(JSON.stringify(heroes[0]));
    res.render('list', {
        locals: {
            heroes
        },
        ...layout
    })
});


app.get('/hero/:id', async (req, res) => {
    const { id } = req.params;
    const hero = await Hero.findByPk(id);
    const sidekicks = await Sidekick.findAll();
    res.render('add-sidekick', {
        locals: {
            hero,
            sidekicks
        },
        ...layout
    })
});
app.post('/hero/:id', async (req, res) => {
    const { id } = req.params;
    const { sidekickId } = req.body;

    const hero = await Hero.findByPk(id);
    const sidekick = await Sidekick.findByPk(sidekickId);

    hero.setSidekick(sidekick);
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

