require('dotenv').config()
const path = require('path');
const express = require('express');
// const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;
const route = require('./routes');
const cookieParse = require('cookie-parser');
const handlebars = require('express-handlebars');
const http = require("http");
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server)

const ChatController = require('./app/controllers/ChatController');

const { addUser, removeUser, getUser, getUserBySocketId, getStatusUsers } = require('./util/userSocket');

const db = require('./config/db/index');

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
// app.use(morgan('combined'));

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
            if (element.type == 'single') {
                const friendUser = getUser(element.userId);
                io.to(friendUser?.socketId).emit("sendMeOnline", {
                    type: element.type,
                    userId: data.userId
                });
            } else {
                socket.join(element.messageId);
                io.to(element.messageId).emit("sendMeOnline", {
                    type: element.type,
                    senderId: data.userId,
                    messId: element.messageId
                });
            }
        });
    });

    socket.on('sendNewContact', async (data) => {
        const receiverUser = getUser(data.receiverId);
        io.to(receiverUser?.socketId).emit("getNewContact", {
            senderId: data.senderId,
            fullname: data.fullname,
            avatar: data.avatar,
            receiverId: data.receiverId,
            message: data.message,
            messId: data.messId,
            time: data.time
        });
    })

    socket.on('sendNewGroup', async (data) => {
        data.memberIdAndAva.forEach(e => {
            if (e.id != data.senderId) {
                var receiverUser = getUser(e.id);
                io.to(receiverUser?.socketId).emit("getNewGroup", {
                    senderId: data.senderId,
                    nameGroup: data.nameGroup,
                    messId: data.messId,
                    memberIdAndAva: data.memberIdAndAva
                });
            }
        })
    })

    socket.on('sendMessageSingle', async (data) => {
        data.type = 'text'
        const chatId = await ChatController.storeChatAndGetId(data);
        const receiverUser = getUser(data.receiverId);
        const senderUser = getUser(data.senderId);
        io.to(receiverUser?.socketId).to(senderUser?.socketId).emit("getMessageSingle", {
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            chatId: chatId,
            time: data.time
        });
    })

    socket.on('sendMessageGroup', async (data) => {
        data.type = 'text'
        const chatId = await ChatController.storeChatAndGetId(data);
        io.to(data.messId).emit('getMessageGroup', {
            senderId: data.senderId,
            message: data.message,
            messId: data.messId,
            chatId: chatId,
            time: data.time
        })
    })

    socket.on('sendReactionChatSingle', async (data) => {
        const receiverUser = getUser(data.receiverId);
        const senderUser = getUser(data.senderId);
        const totalReactions = await ChatController.addReactionChat(data);
        io.to(receiverUser?.socketId).to(senderUser?.socketId).emit("getReactionChatSingle", {
            senderId: data.senderId,
            receiverId: data.receiverId,
            chat_id: data.chat_id,
            totalReactions: totalReactions
        });
    })

    socket.on('sendReactionChatGroup', async (data) => {
        const totalReactions = await ChatController.addReactionChat(data);
        io.to(data.messId).emit("getReactionChatGroup", {
            senderId: data.senderId,
            messId: data.messId,
            chat_id: data.chat_id,
            totalReactions: totalReactions
        });
    })

    socket.on('sendNotifyChatCustomAndOut', async (data) => {
        data.type = 'notify'
        const chatId = await ChatController.storeChatAndGetId(data);
        io.to(data.messId).emit("getNotifyChatCustomAndOut", {
            senderId: data.senderId,
            senderName: data.senderName,
            messId: data.messId,
            chatId: chatId,
            message: data.message
        });
    })

    socket.on('sendNotifyChatAddMem', async (data) => {
        data.type = 'addmember'
        const chatId = await ChatController.storeChatAndGetId(data);
        io.to(data.messId).emit("getNotifyChatAddMem", {
            senderId: data.senderId,
            senderName: data.senderName,
            memberId: data.memberId,
            memberName: data.memberName,
            message: data.message,
            chatId: chatId,
            messId: data.messId,
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
