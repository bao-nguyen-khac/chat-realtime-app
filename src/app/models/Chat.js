const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = new Schema({
    messageId: { type: String },
    user_id: {
        type: String,
        ref: 'Account',
    },
    type: { type: String },
    content: { type: String },
    like: { type: Array, default: [] },
    totalLike: { type: Number, default: 0 },
    user_read: { type: Array, default: [] },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Chat', Chat);
