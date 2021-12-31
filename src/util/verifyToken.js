
const jwt = require('jsonwebtoken');

module.exports = function verifyToken(token) {
    try {
        var checkToken = jwt.verify(token, process.env.JWT_SECRECT);
        if (checkToken) {
            return checkToken._id;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}