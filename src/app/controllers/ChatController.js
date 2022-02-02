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
                });
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
                        }
                    })
            } else {
                await Chat
                    .updateOne({ _id: data.chat_id }, {
                        $addToSet: {
                            like: data.senderId
                        }
                    })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ChatController();
