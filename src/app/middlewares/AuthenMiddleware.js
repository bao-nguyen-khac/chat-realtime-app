const Account = require('../models/Account');
const verifyToken = require('../../util/verifyToken');

module.exports = function AuthenMiddleware(req, res, next) {
    try {
        var token = req.signedCookies.token;
        var checkToken = verifyToken(token);
        if (checkToken) {
            Account.findOne({ _id: checkToken })
                .then(account => {
                    res.locals.userInfo = {
                        id: account._id,
                        fullname: account.fullname,
                        avatar: account.avatar,
                        background_img: account.background_img,
                        sub_desc: account.sub_desc,
                        main_desc: account.main_desc,
                        phone: account.phone,
                        address: account.address,
                    }
                    req.user_id = checkToken;
                    next();
                })
        } else {
            return res.redirect('/auth/user/login');
        }
    } catch (error) {
        return res.redirect('/auth/user/login');
    }
}