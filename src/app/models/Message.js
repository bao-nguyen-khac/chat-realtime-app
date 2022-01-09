const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    messages: [{
        id_user: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        content: {type: String},
        time: {type: String},
        like: [],
        user_read: [],
    }]
});

module.exports = mongoose.model('Message', Message);
