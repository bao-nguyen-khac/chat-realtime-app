const express = require('express');
const route = express.Router();

const UserController = require('../app/controllers/UserController');
const RegisterMiddleware = require('../app/middlewares/RegisterMiddleware');

route.get('/user/login', UserController.login);

route.get('/user/logout', UserController.logout);

route.get('/user/register', UserController.register);

route.post('/user/checkLogin', UserController.checkLogin);

route.post('/user/create', RegisterMiddleware, UserController.storeAccount);

module.exports = route;
