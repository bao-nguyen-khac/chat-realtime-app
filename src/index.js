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

const userController = require('./app/controllers/UserController');

const { addUser, removeUser, getUser } = require('./util/userSocket');

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
    socket.on("join", (userId) => {
        addUser(userId, socket.id);
    });

    socket.on('sendMessage', (data) => {
        // userController.storeMessage(data);
        const user = getUser(data.receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId: data.senderId,
            message: data.message,
            time: data.time
        });
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
    })
});

// Routes init
route(app);
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
