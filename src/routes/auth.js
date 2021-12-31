const express = require('express');
const route = express.Router();

const adminController = require('../app/controllers/AdminController');

route.get('/admin/login', adminController.login);
route.get('/admin/logout', adminController.logout);
route.post('/admin/checkLogin', adminController.checkLogin);
route.get('/admin/register', adminController.register);
route.post('/admin/create', adminController.storeAccount);

module.exports = route;
