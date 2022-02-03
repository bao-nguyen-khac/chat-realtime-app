const express = require('express');
const route = express.Router();

const MessageController = require('../app/controllers/MessageController');


route.get('/get-all-contact', MessageController.getAllContact);

route.get('/', MessageController.getMessage);

module.exports = route;
