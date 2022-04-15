const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudinaryKey,
  api_secret: config.cloudinarySecret,
});

const fileUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "images" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

exports.fileUpload = fileUpload;
