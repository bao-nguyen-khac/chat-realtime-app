const authRoute = require('./auth');
const userRoute = require('./user');
const AuthenMiddleware = require('../app/middlewares/AuthenMiddleware');
const UserController = require('../app/controllers/UserController');
function route(app) {
    
    app.use('/user', AuthenMiddleware, userRoute);
    app.use('/auth', authRoute);
    app.use('/', AuthenMiddleware, UserController.index);
}

module.exports = route;
