const Message = require('../models/Message');
const Account = require('../models/Account');
const Chat = require('../models/Chat');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
class MessageController {
    async getAllMessage(req, res, next) {
        try {
            const messages = await Message
                .find({ 'member': req.user_id })
                .populate('member')
                .sort({ 'updatedAt': -1 });
            return messages;
        } catch (error) {
            next(error)
        }
    }
    async newMessage(req, res, next) {
        try {
            const user = await Account
                .findOne({ phone: req.body.phone });
            if (user) {
                const message = await Message
                    .create({
                        name: user.fullname,
                        type: 'single',
                        member: [req.user_id, user._id]
                    });
                await Chat
                    .create({
                        messageId: message._id,
                        user_id: req.user_id,
                        content: req.body.message,
                        type: 'text'
                    })
                res.redirect('/')
            }
        } catch (error) {
            next(error);
        }
    }
    async getMessage(req, res, next) {
        try {
            const mess_id = req.query.id;
            const infoMessage = await await Message
                .find({ 'member': req.user_id })
                .populate('member')
                .sort({ 'updatedAt': -1 });
            const message = await Message
                .findOne({ _id: mess_id, 'member': req.user_id })
                .populate('member');
            let chats;
            if (message) {
                chats = await Chat
                    .find({ messageId: mess_id })
                    .populate('user_id');
            }
            res.render('user/home', {
                layout: 'user/message',
                message: MongooseToObject(message),
                chats: mutipleMongooseToObject(chats),
                infoMessage: mutipleMongooseToObject(infoMessage)
            })
        } catch (error) {
            next(error);
        }
    }
    async getAllContact(req, res, next) {
        try {
            let listMessage = await Message
                .find({ 'member': req.user_id })
            let allContact = [];
            listMessage.forEach(e => {
                e.member.forEach(e1 => {
                    if (e1 != req.user_id) {
                        allContact.push(e1);
                    }
                })
            })
            res.send(allContact);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new MessageController();
