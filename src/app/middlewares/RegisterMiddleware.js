
module.exports = function RegisterMiddleware(req, res, next) {
    if (req.body.fullname && req.body.phone && req.body.username
        && req.body.password && req.body.phone.length >= 10 && req.body.username.length >= 4
        && req.body.password.length >= 4) {
        next()
    } else {
        return res.redirect('/auth/user/register?message=Can\'t%20register.Try%20again!!&checkRegister=error');
    }
}