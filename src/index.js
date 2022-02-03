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
const MessageController = require('./app/controllers/MessageController');
const ChatController = require('./app/controllers/ChatController');

const { addUser, removeUser, getUser, getUserBySocketId, getStatusUsers } = require('./util/userSocket');

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
    socket.on("join", data => {
        addUser(data.userId, socket.id);
        const senderUser = getUser(data.userId);
        const userOnline = getStatusUsers(data.allContact);
        io.to(senderUser?.socketId).emit("sendUserOnline", userOnline);
        data.allContact.forEach(element => {
            const friendUser = getUser(element);
            io.to(friendUser?.socketId).emit("sendMeOnline", data.userId);
        });
    });

    socket.on('sendMessage', async (data) => {
        const chatId = await ChatController.storeChatAndGetId(data);
        const receiverUser = getUser(data.receiverId);
        const senderUser = getUser(data.senderId);
        io.to(receiverUser?.socketId).emit("getMessage", {
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            chatId: chatId,
            time: data.time
        });
        io.to(senderUser?.socketId).emit("getMessage", {
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            chatId: chatId,
            time: data.time
        });
    })

    socket.on('sendReactionChat', async (data) => {
        const receiverUser = getUser(data.receiverId);
        const senderUser = getUser(data.senderId);
        await ChatController.addReactionChat(data);
        io.to(receiverUser?.socketId).emit("getReactionChat", {
            senderId: data.senderId,
            receiverId: data.receiverId,
            chat_id: data.chat_id
        });
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
        const user = getUserBySocketId(socket.id);
        removeUser(socket.id);
        io.emit("userOff", user);
    })
});

// Routes init
route(app);
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
