const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    name: { type: String },
    type: { type: String },
    messages: [{
        user_id: {
            type: String,
            ref: 'Account',
        },
        content: { type: String },
        time: { type: Date, default: Date.now },
        like: { type: Array, default: [] },
        user_read: { type: Array, default: [] },
    }],
    member: [{ type: Schema.Types.ObjectId, ref: 'Account' }]
},{
    timestamps: true,
});

module.exports = mongoose.model('Message', Message);
