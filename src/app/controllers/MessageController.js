const Message = require('../models/Message');
const Account = require('../models/Account');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
class MessageController {
    newMessage(req, res, next) {
        Account.findOne({ phone: req.body.phone })
            .then(user => {
                if (user) {
                    Message.create({
                        name: 'default',
                        type: 'single',
                        member: [res.user_id, user._id],
                        messages: [{
                            user_id: res.user_id,
                            content: req.body.message,
                        }]
                    })
                        .then(() => res.redirect('/'))
                        .catch(next)
                }
            })
            .catch(next)
    }
    getMessage(req, res, next) {
        const mess_id = req.query.id;
        Promise.all([
            Message.find({ 'member': res.user_id }, { 'messages': 0 })
                .populate('member')
                .sort({ updateAt: -1 }),
            Message.findOne({ _id: mess_id, 'member': res.user_id })
                .populate('member')
                .populate('messages.user_id')
        ])
            .then(([infoMessage, message]) => {
                res.render('user/home', {
                    layout: 'user/message',
                    message: MongooseToObject(message),
                    infoMessage: mutipleMongooseToObject(infoMessage),
                    messActiveID: message._id
                })
            })
            .catch(next)

    }
    async storeChatAndGetId(data) {
        await Message.updateOne({ _id: data.messId }, {
            $push: {
                messages: [{
                    user_id: data.senderId,
                    content: data.message
                }]
            }
        })
        const message = await Message.findOne({_id : data.messId});
        return message.messages[message.messages.length - 1]._id;
    }
}

module.exports = new MessageController();
