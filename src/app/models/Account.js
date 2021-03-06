const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String },
    password: { type: String },
    fullname: { type: String },
    avatar: { type: String },
    background_img: { type: String },
    sub_desc: { type: String },
    main_desc: { type: String },
    phone: { type: String },
    address: { type: String }
});

module.exports = mongoose.model('Account', Account);
