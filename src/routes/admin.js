const express = require('express');
const route = express.Router();
const multer = require('multer');
// const upload = multer({ dest: './src/public/uploads' });
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true })
const adminController = require('../app/controllers/AdminController');

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

route.get('/messenger', adminController.chatMessage);

route.get('/personal-info', csrfProtection, adminController.personalInfo);
route.post('/personal-info/update', upload.single('avatar'), csrfProtection, adminController.updateInfo);

route.get('/', adminController.index);

module.exports = route;
