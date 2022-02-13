const Message = require('../models/Message');
const Account = require('../models/Account');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
class UpdateInfoController {
    personalInfor(req, res, next) {
        const id = req.user_id;
        if (req.files['avatar'] && req.files['background_img']) {
            req.body.avatar = req.files['avatar'][0].path;
            req.body.background_img = req.files['background_img'][0].path;
            Account.updateOne({ _id: id }, {
                fullname: req.body.fullname,
                avatar: req.body.avatar,
                background_img: req.body.background_img,
                sub_desc: req.body.sub_desc,
                main_desc: req.body.main_desc,
                address: req.body.address
            })
                .then(() => {
                    res.redirect('/');
                })
                .catch(next);
        } else if (req.files['avatar'] && !req.files['background_img']) {
            req.body.avatar = req.files['avatar'][0].path;
            Account.updateOne({ _id: id }, {
                fullname: req.body.fullname,
                avatar: req.body.avatar,
                sub_desc: req.body.sub_desc,
                main_desc: req.body.main_desc,
                address: req.body.address
            })
                .then(() => {
                    res.redirect('/');
                })
        } else if (!req.files['avatar'] && req.files['background_img']) {
            req.body.background_img = req.files['background_img'][0].path;
            Account.updateOne({ _id: id }, {
                fullname: req.body.fullname,
                background_img: req.body.background_img,
                sub_desc: req.body.sub_desc,
                main_desc: req.body.main_desc,
                address: req.body.address
            })
                .then(() => {
                    res.redirect('/');
                })
        } else {
            Account.updateOne({ _id: id }, {
                fullname: req.body.fullname,
                sub_desc: req.body.sub_desc,
                main_desc: req.body.main_desc,
                address: req.body.address
            })
                .then(() => {
                    res.redirect('/');
                })
        }
    }
    async groupMessInfo(req, res, next) {
        const messId = req.query.messId;
        if (req.file) {
            await Message.updateOne({ _id: messId }, {
                name: req.body.groupName,
                desc: req.body.groupDesc,
                avatar: req.file.path
            })
        } else {
            await Message.updateOne({ _id: messId }, {
                name: req.body.groupName,
                desc: req.body.groupDesc,
            })
        }
        res.redirect('back');
    }
}

module.exports = new UpdateInfoController();
