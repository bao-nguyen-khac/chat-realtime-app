require('dotenv').config()
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;
const route = require('./routes');
const cookieParse = require('cookie-parser');
const handlebars = require('express-handlebars');
const http = require("http");
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server)

const adminController = require('./app/controllers/AdminController');

const db = require('./confic/db/index');

const hbs = handlebars.create({
    extname: '.hbs',
    helpers: require('./helpers/handlebars'),
});

db.connect();

// Middlleware built-in
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        extended: true,
    }),
); // unicode
app.use(express.json()); // axios, ajax
app.use(cookieParse(process.env.COOKIE_SECRECT)); //cookie parser
// Middleware custome

// Set up
app.use(morgan('combined'));

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resources', 'views'));

// Create socketio
io.on("connection", (socket) => {
    console.log('User connected');
    socket.on('message-outgoing', data => {
        adminController.storeMessage(data);
        io.emit('message-incoming', data);
    })
});

// Routes init
route(app);
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
