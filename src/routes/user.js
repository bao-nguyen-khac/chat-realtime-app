const express = require('express');
const route = express.Router();
const uploads = require('../util/multer.cloudinary');
const UpdateInfoController = require('../app/controllers/UpdateInfoController');
const UserController = require('../app/controllers/UserController');
const MessageController = require('../app/controllers/MessageController');

route.post('/update-personal-infor', uploads.fields([{
    name: 'avatar',
    maxCount: 1
}, {
    name: 'background_img',
    maxCount: 1
}]), UpdateInfoController.personalInfor);

route.post('/search-contact', UserController.seachUser);

route.post('/new-contact', MessageController.newMessage);

route.get('/get-infor', UserController.personalInfo);

module.exports = route;
