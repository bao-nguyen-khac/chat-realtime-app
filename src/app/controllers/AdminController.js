const Account = require('../models/Account');
const AdminMessage = require('../models/AdminMessage');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const verifyToken = require('../../util/verifyToken');
class AdminController {
    index(req, res, next) {
        res.render('admin/home', {
            layout: 'admin/main'
        });
    }
    login(req, res, next) {
        if (req.cookies.token) {
            if (verifyToken(req.cookies.token)) {
                return res.redirect('/admin');
            }
        }
        if (req.query.message) {
            var message = req.query.message;
        }
        res.render('admin/login', {
            layout: 'admin/authentication',
            message: message,
        });
    }
    register(req, res, next) {
        if (req.query.message && req.query.checkRegister) {
            var message = req.query.message;
            var checkRegister = req.query.checkRegister;
        }
        res.render('admin/register', {
            layout: 'admin/authentication',
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
                            res.redirect('/admin');
                        } else {
                            res.redirect('/auth/admin/login?message=Invalid username or password');
                        }
                    });
                } else {
                    res.redirect('/auth/admin/login?message=Invalid username or password');
                }
            })
            .catch(next)
    }
    storeAccount(req, res, next) {
        Account.findOne({ username: req.body.username })
            .then(account => {
                if (account) {
                    res.redirect('/auth/admin/register?message=username is exit!!&checkRegister=error');
                } else {
                    req.body.fullname = 'Your name';
                    req.body.avatar = '/img/avatar-default.png';
                    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                        req.body.password = hash;
                        const _account = new Account(req.body);
                        _account.save()
                            .then(() => res.redirect('/auth/admin/register?message=Register Successfull!!&checkRegister=susccess'))
                            .catch(next)
                    });
                }
            })
            .catch(next)
    }
    logout(req, res, next) {
        res.clearCookie('token');
        res.clearCookie('username');
        res.redirect('/auth/admin/login');
    }
    chatMessage(req, res, next) {
        Promise.all([AdminMessage.find({}).limit(1).sort({ _id: 'desc' }), AdminMessage.find({})])
            .then(([messageLast, messages]) => {
                res.render('admin/chat-message', {
                    layout: 'admin/chat',
                    title: 'Box chat admin',
                    messageLast: mutipleMongooseToObject(messageLast),
                    messages: mutipleMongooseToObject(messages)
                });
            })
            .catch(next);
    }
    storeMessage(data) {
        AdminMessage.create({
            id_user: data.id_user,
            name: data.name,
            message: data.message,
            avatar: data.avatar,
            time: data.time
        })
    }
    personalInfo(req, res, next) {
        const id = verifyToken(req.signedCookies.token);
        Account.findOne({ _id: id })
            .then(user => {
                res.render('admin/personal-info', {
                    layout: 'admin/main',
                    user: MongooseToObject(user),
                    csrfToken: req.csrfToken()
                })
            })
            .catch(next)
    }
    updateInfo(req, res, next) {
        const id = verifyToken(req.signedCookies.token);
        if (req.file) {
            req.body.avatar = '/' + req.file.path.split('\\').slice(2).join('/');
            Account.updateOne({ _id: id }, {
                fullname: req.body.fullname,
                avatar: req.body.avatar
            })
                .then(() => res.redirect('back'))
                .catch(next);
        }
        Account.updateOne({ _id: id }, {
            fullname: req.body.fullname
        })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    pageNotFound(res) {
        res.render('admin/page-not-found', {
            layout: 'admin/main'
        });
    }
}

module.exports = new AdminController();
