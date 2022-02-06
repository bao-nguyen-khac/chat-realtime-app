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
    async newGroupMessage(req, res, next) {
        try {
            var member = req.body.list_ids_group;
            var newMember = [];
            newMember.push(req.user_id);
            member.forEach(e => {
                newMember.push(e);
            })
            await Message.create({
                name: req.body.group_name,
                type: 'group',
                member: newMember,
                desc: req.body.group_desc,
                avatar: 'None',
            })
            res.redirect('/')
        } catch (error) {
            next(error)
        }
    }
    async getMessage(req, res, next) {
        try {
            const mess_id = req.query.id;
            const infoMessage = await Message
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
    async getAllContactSort(req, res, next) {
        try {
            let listMessage = await Message
                .find({ 'member': req.user_id })
                .populate('member')
            let allContactName = [];
            let allContact = [];
            let result = [];
            listMessage.forEach(e => {
                e.member.forEach(e1 => {
                    if (e1._id != req.user_id) {
                        allContactName.push(e1.fullname);
                        allContact.push({fullname: e1.fullname, id: e1._id});
                    }
                })
            })
            allContactName.sort();
            allContactName.forEach(e => {
                result.push(allContact.find(e1 => e1.fullname === e))
            })
            res.send(result);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new MessageController();
