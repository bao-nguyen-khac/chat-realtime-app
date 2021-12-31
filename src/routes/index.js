const adminRoute = require('./admin');
const authRoute = require('./auth');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
function route(app) {
    
    app.use('/admin', AuthenMiddleware, adminRoute);
    app.use('/auth', authRoute);
    app.use('/', AuthenMiddleware, adminRoute);
}

module.exports = route;
