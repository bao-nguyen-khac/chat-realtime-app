const Account = require('../models/Account');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const verifyToken = require('../../util/verifyToken');
const MessageController = require('./MessageController');
class UserController {
    async index(req, res, next) {
        try {
            const messages = await MessageController.getAllMessage(req, res, next);
            res.render('user/home', {
                layout: 'user/main',
                infoMessage: messages,
            })
        } catch (error) {
            next(error);
        }
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
        res.render('user/login', {
            layout: 'user/authentication',
            message: message,
        });
    }
    register(req, res, next) {
        if (req.query.message && req.query.checkRegister) {
            var message = req.query.message;
            var checkRegister = req.query.checkRegister;
        }
        res.render('user/register', {
            layout: 'user/authentication',
            message: message,
            checkRegister: checkRegister
        });
    }
    async checkLogin(req, res, next) {
        try {
            const account = await Account.findOne({ username: req.body.username });
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
        } catch (error) {
            next(error);
        }
    }
    async storeAccount(req, res, next) {
        try {
            const account = await Account.find({
                $or: [{
                    username: req.body.username
                }, {
                    phone: req.body.phone
                }]
            });
            console.log(account)
            if (account.length > 0) {
                res.redirect('/auth/user/register?message=Username%20or%20Phone%20number%20is%20exit!!&checkRegister=error');
            } else {
                req.body.sub_desc = '';
                req.body.main_desc = '';
                req.body.address = '';
                req.body.avatar = '/img/avatar-default.png';
                req.body.background_img = '/img/background_default.jpg';
                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                    req.body.password = hash;
                    const _account = await new Account(req.body);
                    await _account.save();
                    res.redirect('/auth/user/register?message=Register%20Successfull!!&checkRegister=susccess');
                });
                res.redirect('/auth/user/register?message=Register%20Successfull!!&checkRegister=susccess');
            }
        } catch (error) {
            next(error);
        }
    }
    logout(req, res, next) {
        res.clearCookie('token');
        res.redirect('/auth/users/login');
    }
    async seachUser(req, res, next) {
        try {
            var phone = req.body.phone;
            const user = await Account.findOne({ phone: phone });
            if (user) {
                const result = await Message.findOne({
                    type: 'single',
                    member: {
                        $all: [req.user_id, user._id]
                    }
                })
                if (result) {
                    res.send({
                        contacted: 1,
                        user: user
                    });
                } else {
                    res.send({
                        contacted: 0,
                        user: user
                    });
                }
            } else {
                res.send('Not found');
            }
        } catch (error) {
            next(error);
        }
    }
    async personalInfo(req, res, next) {
        try {
            const user_id = req.query.id;
            const user = await Account.findOne({ _id: user_id })
            res.send(user);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController();
