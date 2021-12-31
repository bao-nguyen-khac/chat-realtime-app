const express = require('express');
const route = express.Router();
const multer = require('multer');
const upload = multer({ dest: './src/public/uploads' });
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true })
const adminController = require('../app/controllers/AdminController');

route.get('/messenger', adminController.chatMessage);

route.get('/personal-info', csrfProtection, adminController.personalInfo);
route.post('/personal-info/update', upload.single('avatar'), csrfProtection, adminController.updateInfo);

route.get('/', adminController.index);

module.exports = route;
