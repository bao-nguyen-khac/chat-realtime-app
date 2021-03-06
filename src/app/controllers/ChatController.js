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
                    type: data.type,
                    user_read: [data.senderId]
                });
            await Message
                .updateOne({ _id: data.messId }, {
                    updatedAt: Date.now()
                })
            const chats = await Chat
                .find({ messageId: data.messId })
                .sort({ 'createdAt': -1 }).limit(1);
            return chats[0]._id;
        } catch (error) {
            console.log(error);
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
    async pagingChat(messId, size, page) {
        try {
            const count = await Chat.find({ messageId: messId }).count();
            var numSkip, numChat;
            if (count - size * page < 0) {
                numSkip = 0;
                numChat = count - size * (page - 1);
                if (numChat <= 0) {
                    return false;
                }
            } else {
                numSkip = count - size * page;
                numChat = size;
            }
            return await Chat
                .find({ messageId: messId })
                .populate('user_id')
                .limit(numChat)
                .skip(numSkip);
        } catch (error) {
            return false;
        }

    }
}

module.exports = new ChatController();
