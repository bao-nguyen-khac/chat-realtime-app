const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminMessage = new Schema({
    id_user: { type: String },
    name: { type: String },
    message: { type: String },
    avatar: { type: String },
    time: { type: String }
});

module.exports = mongoose.model('AdminMessage', AdminMessage);
