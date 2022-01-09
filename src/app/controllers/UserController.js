const Account = require('../models/Account');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const verifyToken = require('../../util/verifyToken');
class UserController {
    index(req, res, next) {
        // res.render('users/home', {
        //     layout: 'users/main'
        // });
        res.json('home');
    }
    login(req, res, next) {
        if (req.cookies.token) {
            if (verifyToken(req.cookies.token)) {
                return res.redirect('/');
            }
        }
        if (req.query.message) {
            var message = req.query.message;
        }
        res.render('users/login', {
            layout: 'users/authentication',
            message: message,
        });
    }
    register(req, res, next) {
        if (req.query.message && req.query.checkRegister) {
            var message = req.query.message;
            var checkRegister = req.query.checkRegister;
        }
        res.render('users/register', {
            layout: 'users/authentication',
            message: message,
            checkRegister: checkRegister
        });
    }
    checkLogin(req, res, next) {
        Account.findOne({
            username: req.body.username,
        })
            .then(account => {
                if (account) {
                    bcrypt.compare(req.body.password, account.password, function (err, result) {
                        if (result) {
                            var token = jwt.sign({ _id: account._id }, process.env.JWT_SECRECT);
                            res.cookie('token', token, {
                                signed: true,
                                expires: new Date(Date.now() + 8 * 3600000)
                            });
                            res.redirect('/');
                        } else {
                            res.redirect('/auth/user/login?message=Invalid%20username%20or%20password');
                        }
                    });
                } else {
                    res.redirect('/auth/user/login?message=Invalid%20username%20or%20password');
                }
            })
            .catch(next)
    }
    storeAccount(req, res, next) {
        Account.findOne({ username: req.body.username, phone: req.body.phone })
            .then(account => {
                if (account) {
                    res.redirect('/auth/user/register?message=username%20or%20phone%20number%20is%20exit!!&checkRegister=error');
                } else {
                    req.body.sub_desc = '',
                    req.body.main_desc = '',
                    req.body.address = '',
                    req.body.avatar = '/img/avatar-default.png';
                    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                        req.body.password = hash;
                        const _account = new Account(req.body);
                        _account.save()
                            .then(() => res.redirect('/auth/user/register?message=Register%20Successfull!!&checkRegister=susccess'))
                            .catch(next)
                    });
                }
            })
            .catch(next)
    }
    logout(req, res, next) {
        res.clearCookie('token');
        res.redirect('/auth/users/login');
    }
    // chatMessage(req, res, next) {
    //     Promise.all([AdminMessage.find({}).limit(1).sort({ _id: 'desc' }), AdminMessage.find({})])
    //         .then(([messageLast, messages]) => {
    //             res.render('admin/chat-message', {
    //                 layout: 'admin/chat',
    //                 title: 'Box chat admin',
    //                 messageLast: mutipleMongooseToObject(messageLast),
    //                 messages: mutipleMongooseToObject(messages)
    //             });
    //         })
    //         .catch(next);
    // }
    // storeMessage(data) {
    //     AdminMessage.create({
    //         id_user: data.id_user,
    //         name: data.name,
    //         message: data.message,
    //         avatar: data.avatar,
    //         time: data.time
    //     })
    // }
    // personalInfo(req, res, next) {
    //     const id = verifyToken(req.signedCookies.token);
    //     Account.findOne({ _id: id })
    //         .then(user => {
    //             res.render('admin/personal-info', {
    //                 layout: 'admin/main',
    //                 user: MongooseToObject(user),
    //                 csrfToken: req.csrfToken()
    //             })
    //         })
    //         .catch(next)
    // }
    // updateInfo(req, res, next) {
    //     const id = verifyToken(req.signedCookies.token);
    //     if (req.file) {
    //         req.body.avatar = req.file.path;
    //         Account.updateOne({ _id: id }, {
    //             fullname: req.body.fullname,
    //             avatar: req.body.avatar
    //         })
    //             .then(() => {
    //                 AdminMessage.updateMany({id_user: id}, {
    //                     avatar: req.body.avatar
    //                 })
    //                 .then(() => res.redirect('/admin/personal-info'))
    //                 .catch(next)
    //             })
    //             .catch(next);
    //     }
    //     Account.updateOne({ _id: id }, {
    //         fullname: req.body.fullname
    //     })
    //         .then(() => res.redirect('back'))
    //         .catch(next);
    // }
    // pageNotFound(res) {
    //     res.render('admin/page-not-found', {
    //         layout: 'admin/main'
    //     });
    // }
}

module.exports = new UserController();
