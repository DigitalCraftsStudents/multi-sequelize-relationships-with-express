require('dotenv').config();    // don't forget to require dotenv

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const {
    homeController
} = require('./controllers');

const {
    userRouter,
} = require('./routers');

const {
    User,
    Tool,
    Ledger,
} = require('./models');

const { layout, addToolStatus } = require('./utils');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const logger = morgan('tiny');

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(session({
    store: new FileStore(),  // no options for now
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(logger);

// Parse any form data from POST requests
app.use(express.urlencoded({extended: true}));

// list all tools
app.get('/tools', async (req, res) => {
    let id = -1; // assume they're not logged in
    if (req.session.user) {
        id = req.session.user.id;
    }
    let tools = await Tool.findAll({
        include: [User],

        order: [
            ['name', 'ASC']
        ]
    });
    tools = tools.map(t => addToolStatus(t, id));
    console.log(tools[0]);
    res.render('tools/list', {
        locals: {
            title: 'Tools!',
            tools
        },
        ...layout
    });
});

// borrow one tool
app.post('/tools/:toolId/borrow', async (req, res) => {
    const { id } = req.session.user;
    const { toolId } = req.params;
    if (id) {
        // add it to the ledger
        const entry = await Ledger.create({
            userId: id,
            toolId
        });
        console.log('===== borrowing =====');
        console.log(entry);
        res.redirect('/tools');
    } else {
        res.redirect('/users/login');
    }
});
// return one tool
app.post('/tools/:toolId/return', async (req, res) => {
    // remove it from the ledger
    const { id } = req.session.user;
    const { toolId } = req.params;
    if (id) {
        // add it to the ledger
        const entry = await Ledger.destroy({
            where: {
                userId: id,
                toolId
            }
        });
        console.log('===== returning =====');
        console.log(entry);
        res.redirect('/tools');
    } else {
        res.redirect('/users/login');
    }
});

// show new tool form
app.get('/tools/new', (req, res) => {
    res.render('tools/form', {
        locals: {
            title: 'Add New Tool'
        },
        ...layout
    })
});

// process new tool form
app.post('/tools/new', async (req, res) => {
    const { name } = req.body;
    const tool = await Tool.create({ name });
    res.redirect('/tools');
});

// show new tool form, with list of users
app.get('/tools/lend-new', async (req, res) => {
    const users = await User.findAll();
    res.render('tools/form-lend-new', {
        locals: {
            title: 'Add and Lend New Tool',
            users
        },
        ...layout
    })
});

// process new tool form
app.post('/tools/lend-new', async (req, res) => {
    const { name, userId } = req.body;
    if (userId != -1) { // loose comparison
        const tool = await Tool.create({
            name
        });
        const entry = await Ledger.create({
            toolId: tool.id,
            userId
        });
    }
    res.redirect('/tools');
});


// With button to return tools
app.get('/your-tools', async (req, res) => {
    const { id } = req.session.user;
    const user = await User.findByPk(id, {
        include: [Tool]
    });    
    res.json(user);
});


app.get('/', (req, res) => {
    res.render('home');
});

server.listen(PORT, HOST, () => {
    console.log(`Listening at http://${HOST}:${PORT}`);
});

