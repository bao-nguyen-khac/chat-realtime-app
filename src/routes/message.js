const express = require('express');
const route = express.Router();

const MessageController = require('../app/controllers/MessageController');


route.get('/get-all-contact', MessageController.getAllContact);
route.get('/get-all-contact-sort', MessageController.getAllContactSort);
route.post('/new-group', MessageController.newGroupMessage);

route.get('/', MessageController.getMessage);

module.exports = route;
