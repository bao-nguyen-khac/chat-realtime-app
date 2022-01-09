const authRoute = require('./auth');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
function route(app) {
    
    // app.use('/admin', AuthenMiddleware, adminRoute);
    app.use('/auth', authRoute);
    app.use('/', AuthenMiddleware, UserController.index);
}

module.exports = route;
