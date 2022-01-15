const authRoute = require('./auth');
const userRoute = require('./user');
const messageRoute = require('./message');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
function route(app) {
    
    app.use('/user', AuthenMiddleware, userRoute);
    app.use('/message', AuthenMiddleware, messageRoute);
    app.use('/auth', authRoute);
    app.use('/', AuthenMiddleware, UserController.index);
}

module.exports = route;
