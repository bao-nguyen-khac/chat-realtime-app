const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    name: { type: String },
    type: { type: String },
    member: [{ type: String, ref: 'Account' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', Message);
