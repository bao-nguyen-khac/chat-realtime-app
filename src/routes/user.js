const express = require('express');
const route = express.Router();
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true })

cloudinary.config({
    cloud_name: "be-dev",
    api_key: "512814853798615",
    api_secret: "A8DrMYh1F2H_W5U0St0JgSWAv-c",
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
    },
});
const upload = multer({ storage: storage });

const UserController = require('../app/controllers/UserController');

// route.get('/messenger', UserController.chatMessage);

// route.get('/personal-info', csrfProtection, UserController.personalInfo);
// route.post('/personal-info/update', upload.single('avatar'), csrfProtection, UserController.updateInfo);

route.get('/', UserController.index);

module.exports = route;
