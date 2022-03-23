const express = require('express');
const route = express.Router();
const uploads = require('../util/multer.cloudinary');
const MessageController = require('../app/controllers/MessageController');
const ChatController = require('../app/controllers/ChatController');
const UpdateInfoController = require('../app/controllers/UpdateInfoController');


route.post('/new-group', MessageController.newGroupMessage);

route.post('/read-chat', ChatController.addUserReadChat);

route.post('/group-update-info', uploads.single('groupAva') , UpdateInfoController.groupMessInfo);

route.post('/add-member-group', MessageController.addMemberGroup);

route.post('/out-group', MessageController.outGroup);

route.get('/get-all-contact', MessageController.getAllContact);

route.get('/get-all-contact-sort', MessageController.getAllContactSort);

route.get('/paging-chat', MessageController.pagingChat);

route.get('/', MessageController.getMessage);

module.exports = route;
