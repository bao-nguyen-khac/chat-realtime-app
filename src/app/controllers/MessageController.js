const Message = require('../models/Message');
const Account = require('../models/Account');
const Chat = require('../models/Chat');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const ChatController = require('./ChatController');
class MessageController {
    async getAllMessage(req, res, next) {
        try {
            var messages = await Message
                .find({ 'member': req.user_id })
                .populate('member')
                .sort({ 'updatedAt': -1 });
            messages = mutipleMongooseToObject(messages)
            for (var mess of messages) {
                mess.numUnRead = await Chat
                    .find({ messageId: mess._id, user_read: { $nin: req.user_id } })
                    .count()
            }
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
                        type: 'text',
                        user_read: [req.user_id]
                    })
                const newMess = await Message
                    .find({}).populate('member').sort({ 'updatedAt': -1 }).limit(1)
                res.send(newMess[0])
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
            const newMess = await Message
                .find({}).populate('member').sort({ 'updatedAt': -1 }).limit(1)
            res.send(newMess[0])
        } catch (error) {
            next(error)
        }
    }
    async getMessage(req, res, next) {
        try {
            const mess_id = req.query.id;
            const message = await Message
                .findOne({ _id: mess_id, 'member': req.user_id })
                .populate('member');
            var chats;
            if (message) {
                await Chat
                    .updateMany({ messageId: mess_id }, {
                        $addToSet: {
                            user_read: req.user_id
                        },
                    })
                chats = await ChatController.pagingChat(mess_id, 8, 1);
            }
            if (!chats) {
                chats = []
            }
            var infoMessage = await Message
                .find({ 'member': req.user_id })
                .populate('member')
                .sort({ 'updatedAt': -1 });
            infoMessage = mutipleMongooseToObject(infoMessage)
            for (var mess of infoMessage) {
                mess.numUnRead = await Chat
                    .find({ messageId: mess._id, user_read: { $nin: req.user_id } })
                    .count()
            }
            res.render('user/home', {
                layout: 'user/message',
                message: MongooseToObject(message),
                chats: mutipleMongooseToObject(chats),
                infoMessage: infoMessage
            })
        } catch (error) {
            next(error);
        }
    }
    async pagingChat(req, res, next) {
        try {
            const chats = await ChatController.pagingChat(req.query.messId, 8, req.query.page);
            res.send(chats);
        } catch (error) {
            next(error);
        }
    }
    async getAllContact(req, res, next) {
        try {
            var listMessage = await Message
                .find({ 'member': req.user_id })
            var allContact = [];
            listMessage.forEach(message => {
                if (message.type == 'single') {
                    message.member.forEach(memId => {
                        if (memId != req.user_id) {
                            allContact.push({ type: message.type, userId: memId });
                        }
                    })
                } else {
                    var userIdsGroup = message.member.filter(memId => memId != req.user_id)
                    allContact.push({ type: message.type, userIds: userIdsGroup, messageId: message._id })
                }
            })
            res.send(allContact);
        } catch (error) {
            next(error)
        }
    }
    async getAllContactSort(req, res, next) {
        try {
            var listMessage = await Message
                .find({ 'member': req.user_id })
                .populate('member')
            var allContactName = [];
            var allContact = [];
            var result = [];
            listMessage.forEach(message => {
                if (message.type == 'single') {
                    message.member.forEach(mem => {
                        if (mem._id != req.user_id) {
                            allContactName.push(mem.fullname);
                            allContact.push({ fullname: mem.fullname, id: mem._id });
                        }
                    })
                }
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
    async addMemberGroup(req, res, next) {
        try {
            if (typeof (req.body.list_member_add) == 'string') {
                req.body.list_member_add = [req.body.list_member_add]
            }
            await Message
                .updateOne({ _id: req.query.messId }, {
                    $addToSet: {
                        member: {
                            $each: req.body.list_member_add
                        }
                    }
                })
            res.redirect('back');
        } catch (error) {
            next(error)
        }
    }
    async outGroup(req, res, next) {
        try {
            await Message
                .updateOne({ _id: req.query.messId }, {
                    $pull: {
                        member: req.user_id
                    }
                })
            res.redirect('/');
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new MessageController();
