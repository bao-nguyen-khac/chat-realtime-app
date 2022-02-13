const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

module.exports = multer({ storage: storage })