const Message = require('../models/Message');
const Chat = require('../models/Chat');
const Account = require('../models/Account');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
class ChatController {
    async storeChatAndGetId(data) {
        try {
            await Chat
                .create({
                    messageId: data.messId,
                    user_id: data.senderId,
                    content: data.message,
                    type: 'text',
                    user_read: [data.senderId]
                });
            await Message
                .updateOne({ _id: data.messId }, {
                    updatedAt: Date.now()
                })
            const chats = await Chat
                .find({ messageId: data.messId });
            return chats[chats.length - 1]._id;
        } catch (error) {
            next(error);
        }
    }
    async addReactionChat(data) {
        try {
            const chat = await Chat
                .findOne({ _id: data.chat_id })
            if (chat.like.includes(data.senderId)) {
                await Chat
                    .updateOne({ _id: data.chat_id }, {
                        $pull: {
                            like: data.senderId
                        },
                        $inc: {
                            totalLike: -1
                        }
                    })
            } else {
                await Chat
                    .updateOne({ _id: data.chat_id }, {
                        $addToSet: {
                            like: data.senderId
                        },
                        $inc: {
                            totalLike: 1
                        }
                    })
            }
            const newChat = await Chat
                .findOne({ _id: data.chat_id })
            return newChat.totalLike;
        } catch (error) {
            console.log(error);
        }
    }
    async addUserReadChat(req, res, next) {
        try {
            await Chat
                .updateOne({ _id: req.body.chatId }, {
                    $addToSet: {
                        user_read: req.body.userId
                    },
                })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ChatController();
