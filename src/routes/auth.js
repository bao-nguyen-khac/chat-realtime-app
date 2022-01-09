const express = require('express');
const route = express.Router();

const UserController = require('../app/controllers/UserController');

route.get('/user/login', UserController.login);
route.get('/user/logout', UserController.logout);
route.post('/user/checkLogin', UserController.checkLogin);
route.get('/user/register', UserController.register);
route.post('/user/create', UserController.storeAccount);

module.exports = route;
