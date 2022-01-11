const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    name: { type: String },
    messages: [{
        user_id: {
            type: String,
            ref: 'Account',
        },
        content: {type: String},
        time: {type: String},
        like: [],
        user_read: [],
    }],
    member: [{
        user_id: {
            type: String,
            ref: 'Account',
        }
    }],
});

module.exports = mongoose.model('Message', Message);
